import React, { useState, useEffect } from "react";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Upload, Play, Pause, Video, Music, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Narrativas() {
  const [narrativas, setNarrativas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "audio",
    file: null
  });

  useEffect(() => {
    loadNarrativas();
  }, []);

  const loadNarrativas = async () => {
    setIsLoading(false);
    // Aqui carregaríamos as narrativas quando tivermos a entidade
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      const isAudio = file.type.startsWith('audio/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isAudio && !isVideo) {
        toast.error("Por favor, envie apenas arquivos de áudio ou vídeo");
        return;
      }

      setFormData({ ...formData, file, tipo: isAudio ? "audio" : "video" });
      toast.success(`Arquivo selecionado: ${file.name}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file || !formData.titulo) {
      toast.error("Preencha o título e selecione um arquivo");
      return;
    }

    setUploading(true);
    try {
      // Upload do arquivo
      const { file_url } = await base44.integrations.Core.UploadFile({ file: formData.file });
      
      toast.success("Narrativa compartilhada com sucesso! 🎵");
      
      // Limpar formulário
      setFormData({ titulo: "", descricao: "", tipo: "audio", file: null });
      setShowUploadForm(false);
      await loadNarrativas();
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao enviar narrativa");
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-amber-900">
                  Narrativas Orais
                </h1>
                <p className="text-amber-700">
                  Vozes e histórias dos povos e comunidades tradicionais
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Compartilhar Narrativa
            </Button>
          </div>
        </motion.div>

        {/* Formulário de Upload */}
        <AnimatePresence>
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="mb-8 border-2 border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-pink-900">Compartilhar Nova Narrativa</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowUploadForm(false)}
                      className="text-pink-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Instruções Visuais */}
                    <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-4">
                      <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                        <Music className="w-5 h-5" />
                        Como compartilhar sua narrativa:
                      </h4>
                      <ol className="text-sm text-purple-800 space-y-2 ml-6 list-decimal">
                        <li>Dê um título para sua história</li>
                        <li>Escreva uma breve descrição (opcional)</li>
                        <li>Clique no botão abaixo para escolher seu arquivo de áudio ou vídeo</li>
                        <li>Clique em "Compartilhar" para enviar</li>
                      </ol>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="titulo" className="text-pink-900 font-semibold text-lg">
                        📝 Título da Narrativa *
                      </Label>
                      <Input
                        id="titulo"
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        placeholder="Ex: Cantos dos Anciãos, História da Mandioca..."
                        className="border-pink-300 focus:border-pink-500 text-lg"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descricao" className="text-pink-900 font-semibold text-lg">
                        💭 Descrição (opcional)
                      </Label>
                      <Textarea
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        placeholder="Conte um pouco sobre essa narrativa..."
                        rows={3}
                        className="border-pink-300 focus:border-pink-500"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-pink-900 font-semibold text-lg">
                        🎵 Arquivo de Áudio ou Vídeo *
                      </Label>
                      
                      <div className="border-2 border-dashed border-pink-300 rounded-xl p-8 text-center bg-white hover:bg-pink-50 transition-colors cursor-pointer">
                        <input
                          type="file"
                          id="file-upload"
                          accept="audio/*,video/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                              <Upload className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-pink-900 mb-1">
                                Clique aqui para escolher arquivo
                              </p>
                              <p className="text-sm text-pink-700">
                                Áudio (MP3, WAV, OGG) ou Vídeo (MP4, AVI, MOV)
                              </p>
                            </div>
                            {formData.file && (
                              <div className="mt-2 flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
                                {formData.tipo === "audio" ? <Music className="w-5 h-5 text-green-700" /> : <Video className="w-5 h-5 text-green-700" />}
                                <span className="text-sm font-medium text-green-800">
                                  {formData.file.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowUploadForm(false)}
                        className="border-pink-300 text-pink-700"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={uploading || !formData.file || !formData.titulo}
                        className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                      >
                        {uploading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Compartilhar Narrativa
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card de Boas-vindas quando não há narrativas */}
        <Card className="bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-pink-300">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-purple-900 mb-2">
              Oralidade Ancestral
            </h3>
            <p className="text-purple-800 mb-4 max-w-2xl mx-auto leading-relaxed">
              A palavra falada carrega a força da tradição. Aqui você pode compartilhar 
              narrativas, cantos, histórias e ensinamentos dos guardiões da memória ancestral.
            </p>
            <div className="bg-white/50 rounded-lg p-4 max-w-xl mx-auto">
              <p className="text-sm text-purple-700 italic">
                "A voz que conta uma história planta uma semente na alma de quem escuta"
              </p>
            </div>
            
            {!showUploadForm && (
              <Button
                onClick={() => setShowUploadForm(true)}
                className="mt-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Compartilhar Sua Primeira Narrativa
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}