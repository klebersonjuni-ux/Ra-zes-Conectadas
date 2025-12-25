import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Sun, Moon, Droplets, Leaf } from "lucide-react";

const temposCirulares = [
  { key: "presente", label: "Agora", icon: Clock, color: "from-blue-400 to-blue-600" },
  { key: "plantar", label: "Tempo de Plantar", icon: Leaf, color: "from-green-400 to-green-600" },
  { key: "colher", label: "Tempo de Colher", icon: "🌾", color: "from-yellow-400 to-orange-500" },
  { key: "chuvas", label: "Tempo das Chuvas", icon: Droplets, color: "from-cyan-400 to-blue-500" },
  { key: "seca", label: "Tempo da Seca", icon: Sun, color: "from-orange-400 to-red-500" },
  { key: "lua_nova", label: "Lua Nova", icon: "🌑", color: "from-gray-600 to-gray-800" },
  { key: "lua_cheia", label: "Lua Cheia", icon: "🌕", color: "from-gray-200 to-gray-400" },
  { key: "ancestrais", label: "Tempo Ancestral", icon: "👴🏾", color: "from-purple-400 to-purple-600" },
];

export default function CirculoTemporal({ tempoAtual, setTempoAtual, saberes }) {
  const getSaberesPorTempo = (tempo) => {
    return saberes.filter(saber => saber.tempo_circular === tempo).length;
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200 shadow-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-amber-900 flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-spin-slow">
            <Clock className="w-4 h-4 text-white" />
          </div>
          Círculo do Tempo
        </CardTitle>
        <p className="text-sm text-amber-700">
          Navegar pelos ciclos ancestrais de sabedoria
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {temposCirulares.map((tempo, index) => {
            const IconComponent = tempo.icon;
            const isStringIcon = typeof IconComponent === "string";
            const qtdSaberes = tempo.key === "presente" 
              ? saberes.length 
              : getSaberesPorTempo(tempo.key);

            return (
              <motion.div
                key={tempo.key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className={`w-full h-auto p-3 flex flex-col items-center gap-2 rounded-xl transition-all duration-300 ${
                    tempoAtual === tempo.key
                      ? `bg-gradient-to-r ${tempo.color} text-white shadow-lg border-2 border-white`
                      : "bg-white/60 hover:bg-white/80 text-amber-800 border border-amber-200"
                  }`}
                  onClick={() => setTempoAtual(tempo.key)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tempoAtual === tempo.key ? "bg-white/20" : "bg-amber-100"
                  }`}>
                    {isStringIcon ? (
                      <span className="text-lg">{IconComponent}</span>
                    ) : (
                      <IconComponent className={`w-4 h-4 ${
                        tempoAtual === tempo.key ? "text-white" : "text-amber-700"
                      }`} />
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-medium ${
                      tempoAtual === tempo.key ? "text-white" : "text-amber-800"
                    }`}>
                      {tempo.label}
                    </div>
                    <div className={`text-xs ${
                      tempoAtual === tempo.key ? "text-white/80" : "text-amber-600"
                    }`}>
                      {qtdSaberes} saberes
                    </div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center p-4 bg-white/50 rounded-xl border border-amber-200">
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Tempo Circular:</strong> Na cosmovisão ancestral, o tempo não é linear, mas circular. 
            Cada momento conecta passado, presente e futuro em um fluxo contínuo de sabedoria.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
