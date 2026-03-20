"use client";

const ErrorPage = ({
  error
}: {
  error: Error;
}) => {
  return (
    <main style={{ padding: 32 }}>
      <h1>Cloud dashboard error</h1>
      <p>{error.message}</p>
    </main>
  );
};

export default ErrorPage;
