import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from "./azureAuth";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Alert,
} from "@mui/material";

export default function Login() {
  const { instance, inProgress } = useMsal();
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setError("");

    // Prevent reentrant or popup conflict
    if (isLoggingIn || inProgress !== InteractionStatus.None) {
      setError("Login is already in progress. Please wait.");
      return;
    }

    if (window.opener && !window.opener.closed) {
      setError("Login is already in progress in a popup window.");
      return;
    }

    try {
      setIsLoggingIn(true);
      const response = await instance.loginPopup({
        ...loginRequest,
        prompt: "select_account",
      });
      instance.setActiveAccount(response.account);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
      sx={{
        position: "relative",
        backgroundImage: 'url("/image.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.62)",
          zIndex: 0,
        },
        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 4,
          padding: { xs: 4, sm: 5 },
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Stack spacing={4} alignItems="center">
          <Box
            component="img"
            src="/steme.png"
            alt="STEME Portal Logo"
            sx={{
              width: 200,
              height: "auto",
              objectFit: "contain",
            }}
          />

          {error && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            onClick={handleLogin}
            fullWidth
            size="large"
            disabled={isLoggingIn || inProgress !== InteractionStatus.None}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              paddingY: 1.5,
              borderRadius: 2,
              backgroundColor: "#149c4cff",
              "&:hover": {
                backgroundColor: "#22b55f8f",
              },
            }}
          >
            {isLoggingIn ? "Signing in..." : "Sign in with Microsoft"}
          </Button>

          <Typography variant="body2" color="text.secondary" align="center">
            Please use your school Microsoft account to sign in.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
