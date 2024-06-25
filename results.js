window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const sequence = urlParams.get("sequence");
  const startRoll = urlParams.get("startRoll");
  const endRoll = urlParams.get("endRoll");

  if (sequence && startRoll && endRoll) {
    const start = parseInt(startRoll, 10);
    const end = parseInt(endRoll, 10);
    const resultsContainer = document.getElementById("resultsContainer");

    if (isNaN(start) || isNaN(end)) {
      resultsContainer.innerText =
        "Invalid input. Please enter valid roll numbers.";
      return;
    }

    const resArr = [];

    for (let i = start; i <= end; i++) {
      const rollNumber = sequence + i.toString().padStart(2, "0"); // Ensure roll numbers are formatted correctly
      console.log("Current roll: " + rollNumber);
      const data = await getData(rollNumber);
      if (data) {
        resArr.push(data);
      }
    }

    if (resArr.length === 0) {
      resultsContainer.innerText =
        "No data found for the provided roll numbers.";
      return;
    }
    // Sort the resArr based on CGPA in descending order
    resArr.sort((a, b) => {
      const cgpaA = parseFloat(a.cgpa);
      const cgpaB = parseFloat(b.cgpa);

      // Check if either CGPA is not a number
      if (isNaN(cgpaA) || isNaN(cgpaB)) {
        // Sort invalid CGPA values at the end
        return isNaN(cgpaA) ? 1 : -1;
      }

      // Sort in descending order based on CGPA
      return cgpaB - cgpaA;
    });

    displayResults(resArr, resultsContainer);
  } else {
    document.getElementById("resultsContainer").innerText =
      "No roll number information provided.";
  }
};

async function getData(roll) {
  try {
    const response = await fetch(
      `https://api.campx.in/exams/student-results/external?examType=general&rollNo=${roll}`,
      {
        method: "GET",
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "if-none-match": 'W/"1f95-L4qaAggfB239hX/zgcswdr0K2Hc"',
          origin: "https://ums.campx.in",
          priority: "u=1, i",
          referer: "https://ums.campx.in/",
          "sec-ch-ua":
            '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          "x-api-version": "2",
          "x-tenant-id": "jntugv",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();

    // Check if cgpa is blank or undefined
    let cgpa = data.cgpa;
    if (!cgpa || cgpa.trim() === "") {
      cgpa = "null"; // Display as "null" if cgpa is blank or undefined
    }

    return { fullName: data.student.fullName, cgpa: cgpa };
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return null;
  }
}

function displayResults(data, container) {
  const table = document.createElement("table");
  table.className = "results-table";

  const headers = ["Name", "CGPA"];

  const headerRow = table.insertRow();
  headers.forEach((headerText) => {
    const header = document.createElement("th");
    header.textContent = headerText;
    headerRow.appendChild(header);
  });

  data.forEach((item) => {
    const row = table.insertRow();
    const nameCell = row.insertCell();
    const cgpaCell = row.insertCell();
    nameCell.textContent = item.fullName;
    cgpaCell.textContent = item.cgpa;
  });

  container.innerHTML = ""; // Clear previous content
  container.appendChild(table);

  // Add the note at the bottom
  const note = document.createElement("p");
  note.textContent = "Note: 'null' in CGPA column indicates active backlogs.";
  note.className = "note";
  container.appendChild(note);
}
