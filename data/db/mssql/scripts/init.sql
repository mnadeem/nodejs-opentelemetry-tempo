CREATE DATABASE OtelTempo;
GO
USE OtelTempo;
GO
CREATE TABLE flight (
  id    int IDENTITY(1,1) PRIMARY KEY,
  origin CHAR(3) NOT NULL,
  destination CHAR(3) NOT NULL,
  airline VARCHAR(40) NOT NULL,
  departing DATETIME NOT NULL);
GO

