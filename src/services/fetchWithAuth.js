export const fetchWithAuth = async (url, options = {}) => {
  let accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
  // 1. Asl so'rov yuborish.
  const response = await fetch(url, { ...options });

  // 2. Refresh token qilishga harakat qilamiz
  if (response.status === 403) {
    const refreshResponse = await fetch(
      "https://testaoron.limsa.uz/api/auth/refresh",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );
    const refreshData = await refreshResponse.json();
    if (refreshData?.success) {
      localStorage.setItem("access_token", refreshData.data.access_token);
      localStorage.setItem("refresh_token", refreshData.data.refresh_token);

      accessToken = refreshData.data.access_token;
      return fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } else {
      localStorage.clear();
      window.location.href = "/login";
    }
  }
  return response;
};
