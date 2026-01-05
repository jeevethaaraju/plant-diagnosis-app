document.getElementById("diagnoseBtn").addEventListener("click", async () => {
    const fileInput = document.getElementById("leafPhoto");
    if (!fileInput.files.length) return alert("Take a photo first!");

    const formData = new FormData();
    formData.append("leaf", fileInput.files[0]);

    const resp = await fetch("/diagnose", { method: "POST", body: formData });
    const data = await resp.json();

    // If API returns differently, adjust here
    const diagnosis = data.diagnosis || { name: "Unknown", advice: "No advice available" };

    document.getElementById("result").innerHTML = `
        <p><strong>Disease:</strong> ${diagnosis.name}</p>
        <p><strong>Advice:</strong> ${diagnosis.advice}</p>
    `;
});
