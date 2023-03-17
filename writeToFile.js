function writeToFile(message) {
    const timestamp = new Date().toISOString();
    const content = `${timestamp} - ${message.author.username}: ${message.content}\n`;
    fs.appendFile("log.txt", content, (err) => {
      if (err) throw err;
    });
    console.log(content);
  }