const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `🚀 Server ${PORT}-portda ishlamoqda (${process.env.NODE_ENV})`,
      );
    });
  } catch (error) {
    console.error("❌ Ishga tushirishda xato:", error.message);
    process.exit(1);
  }

  // Bot ALOHIDA — xato bo'lsa ham server o'lmaydi
  try {
    await launchBot(app);
  } catch (err) {
    console.error(
      "⚠️ Bot ishga tushmadi (sayt baribir ishlayapti):",
      err.message,
    );
  }
};
