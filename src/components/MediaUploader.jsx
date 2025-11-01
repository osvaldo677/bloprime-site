import { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function MediaUploader({ label, bucket, path, urls = [], onUploadComplete, recordId }) {
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [progresso, setProgresso] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [mediaUrls, setMediaUrls] = useState(urls || []);
  const inputRef = useRef(null);

  // ✅ Evita loop infinito
  useEffect(() => {
    if (urls && Array.isArray(urls)) {
      const same =
        urls.length === mediaUrls.length &&
        urls.every((u, i) => u === mediaUrls[i]);
      if (!same) setMediaUrls(urls);
    }
  }, [urls]);

  // 📤 Upload com progresso simulado
  const handleUpload = async (file) => {
    if (!file) return;
    if (!bucket || !path || path.includes("undefined")) {
      setErro("⚠️ Caminho inválido. Verifique se o ID do atleta foi carregado corretamente.");
      return;
    }

    setErro("");
    setMensagem("");
    setUploading(true);
    setProgresso(0);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      // Simular progresso local
      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100 * 0.8);
          setProgresso(percent);
        }
      };
      reader.onloadend = async () => {
        setProgresso(80);

        // Upload real para Supabase
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        const publicUrl = data.publicUrl;

        const newUrls =
          bucket === "fotos"
            ? [publicUrl, ...mediaUrls].slice(0, 5)
            : [publicUrl]; // só 1 vídeo

        setMediaUrls(newUrls);
        onUploadComplete && onUploadComplete(newUrls);

        setMensagem(`✅ ${bucket === "fotos" ? "Foto" : "Vídeo"} enviado com sucesso!`);
        setProgresso(100);
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      setErro(`Erro ao enviar ficheiro: ${err.message}`);
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgresso(0);
      }, 4000);
    }
  };

  // 🧹 Apagar ficheiro do storage + limpar banco
  const handleDelete = async (url) => {
    if (!confirm("Deseja realmente eliminar este ficheiro?")) return;

    try {
      const relativePath = url.split(`/object/public/${bucket}/`)[1];
      const { error } = await supabase.storage.from(bucket).remove([relativePath]);
      if (error) throw error;

      const updated = mediaUrls.filter((m) => m !== url);
      setMediaUrls(updated);
      onUploadComplete && onUploadComplete(updated);

      // ✅ Atualiza no banco de dados se tiver recordId
      if (recordId) {
        const fieldName = bucket === "fotos" ? "foto_url" : "video_url";
        const value = bucket === "fotos" ? updated.join(",") : updated[0] || null;

        await supabase.from("athletes").update({ [fieldName]: value }).eq("id", recordId);
      }

      setMensagem("🗑️ Ficheiro eliminado com sucesso!");
    } catch (err) {
      setErro(`Erro ao eliminar: ${err.message}`);
    }
  };

  return (
    <div className="my-4 space-y-4">
      <h3 className="text-md font-semibold text-gray-800">{label}</h3>

      {mensagem && <p className="text-green-600 text-sm">{mensagem}</p>}
      {erro && <p className="text-red-600 text-sm">{erro}</p>}

      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleUpload(e.dataTransfer.files[0]);
        }}
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
      >
        {uploading ? (
          <>
            <p className="text-sm text-blue-600 mb-1">A enviar... {progresso}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progresso}%` }}
              ></div>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-600">
            Clique ou arraste para enviar {bucket === "fotos" ? "imagens" : "vídeos"}.
          </p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={bucket === "fotos" ? "image/*" : "video/*"}
          className="hidden"
          onChange={(e) => handleUpload(e.target.files[0])}
        />
      </div>

      {/* Pré-visualizações */}
      {mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
          {mediaUrls.map((media, i) => (
            <div key={i} className="relative border rounded-lg overflow-hidden">
              {bucket === "fotos" ? (
                <img
                  src={`${media}?t=${Date.now()}`} // força reload sem cache
                  alt="foto"
                  className="w-full h-32 object-cover"
                />
              ) : (
                <video
                  src={media}
                  controls
                  className="w-full h-32 object-cover bg-black"
                />
              )}

              <button
                onClick={() => handleDelete(media)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
