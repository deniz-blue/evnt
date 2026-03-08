export const indexhtml = () => {
    const redirector = "https://eventsl.ink";

    return (
        `<!DOCTYPE html>
            <script>
                window.location = ${JSON.stringify(redirector)} + "/?" + new URLSearchParams({
                    action: "view-index",
                    index: window.location.hostname + window.location.pathname + (window.location.pathname.endsWith("/") ? ".index.json" : "/.index.json"),
                }).toString();
            </script>
        </html>`
    );
};
