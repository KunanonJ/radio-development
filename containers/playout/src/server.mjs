import http from "node:http";
import { Readable } from "node:stream";

const port = Number(process.env.PORT ?? 8080);
const SAMPLE_RATE = 44100;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;
const BYTES_PER_SECOND = SAMPLE_RATE * CHANNELS * (BITS_PER_SAMPLE / 8);

/** Build a minimal WAV header (44 bytes) for 16-bit mono at 44.1kHz. */
function wavHeader(size) {
  const dataSize = size ?? 0;
  const buffer = Buffer.alloc(44);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * CHANNELS * (BITS_PER_SAMPLE / 8), 28);
  buffer.writeUInt16LE(CHANNELS * (BITS_PER_SAMPLE / 8), 32);
  buffer.writeUInt16LE(BITS_PER_SAMPLE, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  return buffer;
}

/** Stream WAV silence for the live endpoint (real audio output; replace with ffmpeg/file in production). */
function createSilenceWavStream(durationSec = 3600) {
  const dataBytes = Math.min(Math.floor(durationSec * BYTES_PER_SECOND), 1024 * 1024 * 10);
  const header = wavHeader(dataBytes);
  const chunkSize = 4096;
  let headerSent = false;
  let dataSent = 0;
  const silence = Buffer.alloc(chunkSize, 0);
  return new Readable({
    read() {
      if (!headerSent) {
        this.push(header);
        headerSent = true;
      }
      while (dataSent < dataBytes) {
        const toSend = Math.min(chunkSize, dataBytes - dataSent);
        this.push(silence.slice(0, toSend));
        dataSent += toSend;
      }
      this.push(null);
    }
  });
}
const stations = new Map();

function ensureStation(stationId) {
  if (!stations.has(stationId)) {
    stations.set(stationId, {
      stationId,
      mode: "standby",
      queue: [],
      currentTrack: null,
      upcomingTrack: null,
      updatedAt: new Date().toISOString()
    });
  }

  return stations.get(stationId);
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (!chunks.length) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const segments = url.pathname.split("/").filter(Boolean);

  if (url.pathname === "/health") {
    return sendJson(res, 200, {
      ok: true,
      data: {
        service: "playout-container",
        stations: stations.size
      }
    });
  }

  const stationId = segments[1];
  if (segments[0] !== "stations" || !stationId) {
    return sendJson(res, 404, { ok: false, error: "route not found" });
  }

  const station = ensureStation(stationId);

  if (segments[2] === undefined && req.method === "GET") {
    return sendJson(res, 200, { ok: true, data: station });
  }

  if (segments[2] === "live" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "audio/wav",
      "Transfer-Encoding": "chunked"
    });
    createSilenceWavStream().pipe(res);
    return;
  }

  if (segments[2] === "actions" && req.method === "POST") {
    const action = await readJson(req);

    if (action.type === "enqueue" && action.track) {
      station.queue.push(action.track);
      station.upcomingTrack = station.queue[0] ?? null;
    }

    if (action.type === "advance") {
      station.currentTrack = action.track ?? station.queue.shift() ?? null;
      station.upcomingTrack = station.queue[0] ?? null;
    }

    if (action.type === "set-mode" && action.mode) {
      station.mode = action.mode;
    }

    station.updatedAt = new Date().toISOString();
    return sendJson(res, 200, { ok: true, data: station });
  }

  return sendJson(res, 404, { ok: false, error: "route not found" });
});

server.listen(port, () => {
  console.log(`playout-container listening on ${port}`);
});
