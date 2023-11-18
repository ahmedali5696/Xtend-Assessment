import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./store/redux";
import ReduxProvider from "./store/ReduxProvider";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Budget Tracker",
  description: "Xtend EG, Junior Frontend Developer Assessment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Box sx={{ maxWidth: { xs: "100%", md: 1000 }, p: 3, mx: "auto" }}>
          <ReduxProvider>{children}</ReduxProvider>
        </Box>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
