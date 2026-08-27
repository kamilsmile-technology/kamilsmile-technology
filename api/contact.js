const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#39;"
        }[character];
    });
}

module.exports = async function handler(request, response) {
    if (request.method !== "POST") {
        return response.status(405).json({ error: "Method not allowed." });
    }

    const fields = request.body && typeof request.body === "object"
        ? request.body
        : {};
    const name = typeof fields.name === "string" ? fields.name.trim() : "";
    const normalizedEmail = typeof fields.email === "string"
        ? fields.email.trim()
        : "";
    const message = typeof fields.message === "string"
        ? fields.message.trim()
        : "";

    if (
        name.length < 2 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
        message.length < 10
    ) {
        return response.status(400).json({
            error: "Please provide a valid name, email address, and message."
        });
    }

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_TO_EMAIL) {
        return response.status(500).json({
            error: "Email service is not configured."
        });
    }

    const submittedFields = Object.entries(fields)
        .map(function ([fieldName, fieldValue]) {
            const value = Array.isArray(fieldValue)
                ? fieldValue.join(", ")
                : String(fieldValue ?? "");
            const label = fieldName.replace(/[-_]+/g, " ");
            return "<p><strong>" + escapeHtml(label) + ":</strong> " +
                escapeHtml(value).replace(/\n/g, "<br>") + "</p>";
        })
        .join("");

    try {
        const resendResponse = await fetch(RESEND_ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + process.env.RESEND_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: process.env.RESEND_FROM_EMAIL || "KAMILSMILE TECHNOLOGY <onboarding@resend.dev>",
                to: [process.env.RESEND_TO_EMAIL],
                reply_to: normalizedEmail,
                subject: "New website message from " + name,
                html:
                    "<h2>New contact message</h2>" +
                    submittedFields
            })
        });

        if (!resendResponse.ok) {
            return response.status(502).json({
                error: "The email service could not send your message."
            });
        }

        return response.status(200).json({ ok: true });
    } catch (error) {
        return response.status(500).json({
            error: "Unable to reach the email service."
        });
    }
};