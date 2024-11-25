import React from "react";
import ReactDOM from "react-dom";
import "./index.css"; // Nếu chưa có, bạn có thể tạo tệp CSS trống
import App from "./App";

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
