import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { 
  Play, 
  Pause, 
  MapPin, 
  User, 
  Clock,
  Leaf,
  Heart,
  Share,
  BookOpen,
  Copy,
  Check
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const tipoIcons = {
  medicina_tradicional: Heart,
  agricultura_ancestral: Leaf,
  artesanato: "🎨",
  musica_oral: "🎵", 
  historia_oral: BookOpen,
  praticas_espirituais: "🔮",
  culinaria_tradicional: "🍽️",
  tecnologias_sociais: "🤝"
};

const territorioColors = {
  quilombo: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300",
  aldeia: "bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border-green-300",
  periferia: "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300",
  floresta: "bg-gradient-to-r from-emerald-100 to-green-200 text-emerald-800 border-emerald-300",
  campo: "bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-800 border-yellow-300",
  cidade: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
  rio: "bg-gradient-to-r from-cyan-100 to-blue-200 text-cyan-800 border-cyan-300",
  montanha: "bg-gradient-to-r from-stone-100 to-gray-200 text-stone-800 border-stone-300"
};

export default function SaberCard({ saber, index, onUpdate, user }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showFullNarrative, setShowFullNarrative] = useState(false);
  const [isValorizing, setIsValorizing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const IconComponent = tipoIcons[saber.tipo];
  const isStringIcon = typeof IconComponent === "string";
  
  const jaValorizou = user && (saber.valorizacoes || []).includes(user.email);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    // Aqui implementaríamos a lógica real de áudio
  };

  const handleValorizar = async () => {
    if (!user) {
      toast.error("Faça login para valorizar saberes");
      return;
    }

    setIsValorizing(true);
    try {
      const valorizacoes = saber.valorizacoes || [];
      const novasValorizacoes = jaValorizou
        ? valorizacoes.filter(email => email !== user.email)
        : [...valorizacoes, user.email];

      await base44.entities.Saber.update(saber.id, {
        valorizacoes: novasValorizacoes
      });

      toast.success(jaValorizou ? "Valorização removida" : "Saber valorizado! 🌱");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao valorizar:", error);
      toast.error("Erro ao valorizar saber");
    }
    setIsValorizing(false);
  };

  const handleCompartilhar = async () => {
    setIsSharing(true);
    try {
      // Incrementar contador de compartilhamentos
      await base44.entities.Saber.update(saber.id, {
        compartilhamentos: (saber.compartilhamentos || 0) + 1
      });

      // Copiar link para área de transferência
      const link = `${window.location.origin}${window.location.pathname}?saber=${saber.id}`;
      await navigator.clipboard.writeText(link);
      
      setCopied(true);
      toast.success("Link copiado! Compartilhe este saber ancestral 🌿");
      
      setTimeout(() => setCopied(false), 2000);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      toast.error("Erro ao compartilhar saber");
    }
    setIsSharing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, rotate: 1, transition: { duration: 0.2 } }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-amber-100 hover:border-amber-300 transition-all duration-300 shadow-lg hover:shadow-2xl rounded-3xl overflow-hidden">
        {/* Cabeçalho com gradiente orgânico */}
        <CardHeader className="pb-3 relative">
          <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full opacity-20 transform rotate-45"></div>
          
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              {isStringIcon ? (
                <span className="text-2xl">{IconComponent}</span>
              ) : (
                <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
                  <IconComponent className="w-5 h-5 text-amber-700" />
                </div>
              )}
              <Badge className={`${territorioColors[saber.territorio]} border`}>
                <MapPin className="w-3 h-3 mr-1" />
                {saber.territorio}
              </Badge>
            </div>
            
            {saber.audio_url && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-amber-100"
                onClick={toggleAudio}
              >
                {isPlayingAudio ? 
                  <Pause className="w-4 h-4 text-amber-700" /> : 
                  <Play className="w-4 h-4 text-amber-700" />
                }
              </Button>
            )}
          </div>

          <CardTitle className="text-amber-900 text-lg font-bold leading-tight">
            {saber.titulo}
          </CardTitle>

          <div className="flex items-center gap-4 text-sm text-amber-700 mt-2">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{saber.guardiao}</span>
            </div>
            {saber.tempo_circular && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="capitalize">{saber.tempo_circular.replace("_", " ")}</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Imagem do saber (se houver) */}
          {saber.imagem_url && (
            <div className="mb-4 rounded-xl overflow-hidden">
              <img 
                src={saber.imagem_url} 
                alt={saber.titulo}
                className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Narrativa */}
          <div className="mb-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              {showFullNarrative || !saber.narrativa || saber.narrativa.length <= 120
                ? saber.narrativa 
                : `${saber.narrativa.slice(0, 120)}...`
              }
            </p>
            {saber.narrativa && saber.narrativa.length > 120 && (
              <button 
                className="text-amber-700 text-xs font-medium mt-2 hover:text-amber-800"
                onClick={() => setShowFullNarrative(!showFullNarrative)}
              >
                {showFullNarrative ? "Ver menos" : "Continuar lendo"}
              </button>
            )}
          </div>

          {/* Comunidade */}
          {saber.comunidade && (
            <div className="flex items-center gap-2 mb-4 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
              <span className="text-xs font-medium text-amber-800">Comunidade:</span>
              <span className="text-xs text-amber-700">{saber.comunidade}</span>
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-between items-center pt-3 border-t border-amber-100">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`${
                jaValorizou 
                  ? "text-pink-600 hover:text-pink-700" 
                  : "text-amber-700 hover:text-amber-800"
              } hover:bg-amber-50`}
              onClick={handleValorizar}
              disabled={isValorizing}
            >
              <Heart className={`w-4 h-4 mr-1 ${jaValorizou ? "fill-current" : ""}`} />
              <span className="text-xs">
                {saber.valorizacoes?.length || 0}
              </span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="text-amber-700 hover:text-amber-800 hover:bg-amber-50"
              onClick={handleCompartilhar}
              disabled={isSharing}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copiado
                </>
              ) : (
                <>
                  <Share className="w-4 h-4 mr-1" />
                  {saber.compartilhamentos > 0 && (
                    <span className="text-xs ml-1">{saber.compartilhamentos}</span>
                  )}
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500 mt-2 text-right">
            Compartilhado em {format(new Date(saber.created_date), "d MMM yyyy", { locale: ptBR })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}