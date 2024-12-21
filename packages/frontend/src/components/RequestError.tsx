function RequestError({ error }: { error: Error }) {
  return (
    <>
      <p className="text-danger mt-4">
        <strong>An error occurred {error.message}</strong>
      </p>
    </>
  );
}

export default RequestError;
