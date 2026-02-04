const XLSX = require("xlsx");

class TimetableParser {
  constructor(schoolName = null) {
    this.errors = [];
    this.parsedSessions = [];
    this.schoolName = schoolName; 
  }

  async parseFile(fileBuffer, fileName) {
    try {
      this.errors = [];
      this.parsedSessions = [];

      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rawData = XLSX.utils.sheet_to_json(worksheet, { 
        defval: "", 
        blankrows: false,
        raw: false 
      });

      rawData.forEach((row, index) => {
        this.parseRowWithTimeSlots(row, index + 2);
      });

      return {
        success: true,
        sessions: this.parsedSessions,
        errors: this.errors,
        stats: {
          totalRows: rawData.length,
          parsedSessions: this.parsedSessions.length,
          errorCount: this.errors.length,
        }
      };
    } catch (error) {
      return { success: false, message: `Failed to parse file: ${error.message}` };
    }
  }

  parseRowWithTimeSlots(row, rowNumber) {
    const dayKey = Object.keys(row)[0];
    const day = row[dayKey];
    
    if (!day || day.toString().trim() === "") {
      return; 
    }

    const normalizedDay = this.normalizeDay(day);

    Object.keys(row).forEach((columnHeader) => {
      if (columnHeader === dayKey) return; 

      const cellContent = row[columnHeader];
      if (!cellContent || cellContent.toString().trim() === "") {
        return; 
      }

      const timeSlot = this.extractTimeSlot(columnHeader);
      
      const parsed = this.parseJammedCell(
        cellContent.toString().trim(),
        normalizedDay,
        timeSlot,
        rowNumber
      );

      if (parsed) {
        this.parsedSessions.push(parsed);
      }
    });
  }

  parseJammedCell(cellContent, day, timeSlot, rowNumber) {
    const isOnline = cellContent.toUpperCase().includes("ONLINE");
    
    let room = "ONLINE";
    let contentWithoutRoom = cellContent;
    
    if (!isOnline) {
      const roomMatch = cellContent.match(/\b([AL]\d+)\b(?!.*\b[AL]\d+\b)/i);
      if (roomMatch) {
        room = roomMatch[1].toUpperCase();
        contentWithoutRoom = cellContent.substring(0, roomMatch.index).trim();
      } else {
        this.errors.push({ 
          row: rowNumber, 
          content: cellContent.substring(0, 50),
          message: "No valid room found (expected A### or L###), treating as ONLINE" 
        });
        room = "ONLINE";
      }
    } else {
      contentWithoutRoom = cellContent.replace(/ONLINE/gi, "").trim();
    }

    const unitCodeMatch = contentWithoutRoom.match(/\b([A-Z]{2,3})\s+(\d{2,3})\b/i);
    
    if (!unitCodeMatch) {
      this.errors.push({ 
        row: rowNumber, 
        content: cellContent.substring(0, 50),
        message: "Could not extract unit code" 
      });
      return null;
    }

    const unitCode = `${unitCodeMatch[1].toUpperCase()} ${unitCodeMatch[2]}`;
    const unitCodeStartIndex = contentWithoutRoom.indexOf(unitCodeMatch[0]);
    const unitCodeEndIndex = unitCodeStartIndex + unitCodeMatch[0].length;
    const lecName = contentWithoutRoom.substring(0, unitCodeStartIndex).trim() || "Staff";
    const unitTitle = contentWithoutRoom.substring(unitCodeEndIndex).trim() || "N/A";

    if (this.schoolName) {
      const combinedText = `${lecName} ${unitCode} ${unitTitle}`.toLowerCase();
      if (!combinedText.includes(this.schoolName.toLowerCase())) {
        return null;
      }
    }

    return {
      unitCode,
      unitTitle,
      lecName,
      day,
      startTime: timeSlot.start,
      endTime: timeSlot.end,
      room
    };
  }

  extractTimeSlot(columnHeader) {
    const timeMatch = columnHeader.match(/(\d{4})-(\d{4})/);
    
    if (timeMatch) {
      const start = this.formatTime(timeMatch[1]);
      const end = this.formatTime(timeMatch[2]);
      return { start, end };
    }

    return { start: "09:00", end: "10:30" };
  }

  formatTime(timeString) {
    if (timeString.length === 4) {
      const hours = timeString.substring(0, 2);
      const minutes = timeString.substring(2, 4);
      return `${hours}:${minutes}`;
    }
    return timeString;
  }

  normalizeDay(day) {
    const d = day.toString().toLowerCase();
    if (d.includes("mon")) return "Monday";
    if (d.includes("tue")) return "Tuesday";
    if (d.includes("wed")) return "Wednesday";
    if (d.includes("thu")) return "Thursday";
    if (d.includes("fri")) return "Friday";
    if (d.includes("sat")) return "Saturday";
    if (d.includes("sun")) return "Sunday";
    return day; 
  }
}

module.exports = TimetableParser;