const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: process.env.API_KEY
    // "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjlhMmI2MjBiNjMwYjViM2RmYWEyMzBhNDIzODFiMCIsInN1YiI6IjY1OTNjZGE0Y2U0ZGRjNmU2NDdkZGIyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4CSbF2T53qjlLENtBlffmhp-YxvcN7oE5otcgSdDpHc"
  }
};

export default options;
