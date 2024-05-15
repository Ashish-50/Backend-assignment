const express = require("express");
const cors = require("cors");
const connectDB = require("./database");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const morgan = require('morgan');
const { PORT, ORIGIN } = require("./config");

const app = express();
app.use(cors({ origin: ORIGIN, credentials: true  }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(morgan(':date[iso] :method :url :status :response-time ms'));

// routes
app.get("/healthz", (req, res) => res.send("Online"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/user", require("./routes/user.route"));
app.use("/api/category", require("./routes/category.route"));
app.use("/api/book", require("./routes/audioBook.route"));

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server started at PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

app.use(globalErrorHandler);
startServer();
