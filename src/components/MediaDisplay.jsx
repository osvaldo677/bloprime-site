export default function MediaDisplay({ fotoUrl, videoUrl, nome, tipo }) {
  const formatYouTubeUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v="))
      return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    return url;
  };

  const embedUrl = formatYouTubeUrl(videoUrl);

  return (
    <div className="w-full mt-6 space-y-6">
      {/* FOTO */}
      <div className="flex flex-col items-center">
        {fotoUrl ? (
          <>
            <img
              src={fotoUrl}
              alt={`Foto de ${nome || "utilizador"}`}
              className="w-40 h-40 object-cover rounded-full border shadow-sm"
            />
            <p className="text-sm text-gray-500 mt-2">📸 Foto de perfil</p>
          </>
        ) : (
          <div className="w-40 h-40 flex items-center justify-center rounded-full border text-gray-400 bg-gray-50">
            Sem foto
          </div>
        )}
      </div>

      {/* VÍDEO */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          🎥 Vídeo de Apresentação
        </h3>

        {videoUrl ? (
          embedUrl && embedUrl.includes("youtube.com") ? (
            <div className="relative w-[320px] aspect-video mx-auto">
              <iframe
                src={embedUrl}
                title={`Vídeo de ${nome || "utilizador"}`}
                allowFullScreen
                className="w-full h-full rounded-lg border"
              ></iframe>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-[320px] aspect-video border rounded overflow-hidden shadow">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-contain bg-black"
                />
              </div>
              <button
                onClick={() => window.open(videoUrl, "_blank")}
                className="mt-2 text-blue-600 text-sm underline hover:text-blue-800"
              >
                🔍 Ver vídeo em tamanho completo
              </button>
            </div>
          )
        ) : (
          <p className="text-gray-500 text-sm italic text-center">
            Nenhum vídeo de apresentação disponível.
          </p>
        )}
      </div>
    </div>
  );
}
