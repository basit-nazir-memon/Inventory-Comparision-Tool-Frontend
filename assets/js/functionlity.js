const BACKEND_URL = "https://inventory-comparision-tool.onrender.com";

const handleSubmit = async () => {
    const button = document.getElementById('compareButton');
    button.disabled = true;
    const originalContent = button.innerHTML;
    button.innerHTML = '<img src="./assets/css/Spinner.gif" alt="Loading..." />';

    const fbaFile = document.getElementById('fbaFileInput').files[0];
    const shopifyFile = document.getElementById('shopifyFileInput').files[0];

    if (!fbaFile || !shopifyFile) {
        alert("Please upload both files before submitting.");
        button.disabled = false;
        button.innerHTML = originalContent;
        return;
    }

    const formData = new FormData();
    formData.append("fbaFile", fbaFile);
    formData.append("shopifyFile", shopifyFile);

    try {
        const response = await fetch(`${BACKEND_URL}/compare`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to process files");
        }

        const fileBlob = await response.blob();
        const fileURL = URL.createObjectURL(fileBlob);

        const downloadLink = document.createElement('a');
        downloadLink.href = fileURL;
        downloadLink.download = 'audit_report.csv';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(fileURL);

        // Reset file inputs after successful download
        document.getElementById('fbaFileInput').value = '';
        document.getElementById('shopifyFileInput').value = '';
    } catch (error) {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
    } finally {
        button.disabled = false;
        button.innerHTML = originalContent;
    }
};


