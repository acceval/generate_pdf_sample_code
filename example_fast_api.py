async def update_slide(presentationId: str, updates_content):
    # Construct the data to send to Google Apps Script
    data = {"presentationId": presentationId, "updates": updates_content}

    # URL of your Google Apps Script web app
    script_url = "https://script.google.com/macros/s/AKfycbxwm_c8N-wYzkh8X3W_qofD9vpJgZ-nPUWcmjWRpVY5XoNFGMQgsCkvOVGc7TtUPbjM/exec"
    timeout = httpx.Timeout(10.0, read=180.0)
    # Send a POST request to Google Apps Script
    async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
        response = await client.post(script_url, json=data)
        link = response.text
        file_id = extract_file_id(link)
        link_download = f"https://drive.google.com/uc?id={file_id}"

        dst_path = f"{str(uuid.uuid4())}.pdf"
        output_name = f"/tmp/{dst_path}"

        gdown.download(link_download, output_name, quiet=False)
        public_url = upload_to_gcs(output_name, dst_path)

        return public_url
