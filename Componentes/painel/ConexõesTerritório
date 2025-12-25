import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Eye, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const territorioEmojis = {
  quilombo: "🏘️",
  aldeia: "🌳",
  periferia: "🏢", 
  floresta: "🌲",
  campo: "🌾",
  cidade: "🏙️",
  rio: "🏞️",
  montanha: "⛰️"
};

const territorioColors = {
  quilombo: "from-purple-400 to-purple-600",
  aldeia: "from-green-400 to-emerald-600", 
  periferia: "from-orange-400 to-orange-600",
  floresta: "from-emerald-400 to-green-600",
  campo: "from-yellow-400 to-amber-600",
  cidade: "from-blue-400 to-blue-600",
  rio: "from-cyan-400 to-blue-600",
  montanha: "from-stone-400 to-gray-600"
};

export default function ConexoesTerritorio({ comunidades, isLoading }) {
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-emerald-200 shadow-xl h-full">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-emerald-200 shadow-xl h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          Territórios Conectados
        </CardTitle>
        <p className="text-sm text-emerald-700">
          Mapeando as redes de sabedoria que unem nossas comunidades ancestrais
        </p>
      </CardHeader>
      
      <CardContent>
        {comunidades.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-emerald-200 to-green-200 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-emerald-700" />
            </div>
            <p className="text-emerald-800 font-medium">Nenhuma comunidade cadastrada</p>
            <p className="text-emerald-600 text-sm">As primeiras comunidades aparecerão aqui</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {comunidades.slice(0, 9).map((comunidade, index) => (
                <motion.div
                  key={comunidade.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedCommunity(comunidade)}
                >
                  <Card className={`bg-gradient-to-r ${territorioColors[comunidade.tipo_territorio]} border-0 text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl mb-2">
                        {territorioEmojis[comunidade.tipo_territorio]}
                      </div>
                      <div className="text-xs font-bold truncate mb-1">
                        {comunidade.nome}
                      </div>
                      <div className="text-xs opacity-90 truncate">
                        {comunidade.localizacao}
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="mt-2 bg-white/20 text-white border-white/30 text-xs px-2 py-1"
                      >
                        {comunidade.tipo_territorio.replace("_", " ")}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Comunidade Selecionada */}
            {selectedCommunity && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white/80 rounded-xl border border-emerald-200 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                      <span className="text-lg">{territorioEmojis[selectedCommunity.tipo_territorio]}</span>
                      {selectedCommunity.nome}
                    </h4>
                    <p className="text-sm text-emerald-700">{selectedCommunity.localizacao}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCommunity(null)}
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    ✕
                  </Button>
                </div>

                {selectedCommunity.descricao && (
                  <p className="text-sm text-emerald-800 mb-3 leading-relaxed">
                    {selectedCommunity.descricao}
                  </p>
                )}

                {selectedCommunity.liderancas && selectedCommunity.liderancas.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-emerald-900 mb-1">Lideranças:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedCommunity.liderancas.map((lideranca, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-emerald-300 text-emerald-800">
                          {lideranca}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-emerald-600 to-green-600 text-white"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Explorar Comunidade
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {comunidades.length > 9 && (
              <div className="text-center mt-4">
                <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                  Ver todas as {comunidades.length} comunidades
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
