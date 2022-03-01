// Helper function for variable based async calls

async function tryCatchHelper(promise) {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

module.exports = tryCatchHelper;
