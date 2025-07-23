export const msalConfig = {
  auth: {
    clientId: "52fb4ed9-4f77-44cc-8317-8dc98b8b1454", // Application (client) ID from Azure
    authority: "https://login.microsoftonline.com/9506873c-36f7-4175-ba9f-d69f0b602b83", // Directory (tenant) ID
    redirectUri: "http://localhost:3000", // Your redirect URI
  },
};

export const loginRequest = {
  scopes: ["User.Read", "Mail.Send"],  // ✅ Added Mail.Send scope
};
