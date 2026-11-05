(() => {
  "use strict";

  // Se carga el código original comprimido para mantenerlo íntegro.
  const sourceUrl = new URL("./app-source.js.gz.b64", document.currentScript.src);

  (async () => {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error("No se pudo cargar el código de Cubatero.");
    }

    const encoded = (await response.text()).trim();
    const binary = atob(encoded);
    const compressed = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    if (typeof DecompressionStream === "undefined") {
      throw new Error("Este navegador no admite la descompresión necesaria para cargar Cubatero.");
    }

    const stream = new Blob([compressed])
      .stream()
      .pipeThrough(new DecompressionStream("gzip"));
    const source = await new Response(stream).text();

    const script = document.createElement("script");
    script.src = URL.createObjectURL(
      new Blob([source], { type: "text/javascript" })
    );
    script.onerror = () => console.error("No se pudo iniciar Cubatero.");
    document.body.appendChild(script);
  })().catch((error) => {
    console.error("Error al iniciar Cubatero:", error);
    const message = document.createElement("p");
    message.textContent = "No se ha podido cargar Cubatero. Recarga la página o prueba con un navegador actualizado.";
    message.style.cssText = "margin:24px;padding:16px;color:#f5e7da;background:#221c29;border-radius:12px;font:14px system-ui";
    document.body.appendChild(message);
  });
})();
