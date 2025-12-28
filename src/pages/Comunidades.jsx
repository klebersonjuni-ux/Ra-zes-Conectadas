import React, { useState, useEffect } from "react";
import { api } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search, MapPin, Plus, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function Comunidades() {
  const [comunidades, setComunidades] = useState([]);
  const [comunidadesVirtuais, setComunidadesVirtuais] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [currentUser, comunidadesFisicas, comunidadesVirt] = await Promise.all([
        base44.auth.me(),
        base44.entities.Comunidade.list("-created_date"),
        base44.entities.ComunidadeVirtual.list("-created_date")
      ]);
      setUser(currentUser);
      setComunidades(comunidadesFisicas);
      setComunidadesVirtuais(comunidadesVirt);
    } catch (error) {
      console.error("Erro ao carregar comunidades:", error);
    }
    setIsLoading(false);
  };

  const comunidadesFiltradas = comunidades.filter(com =>
    busca === "" || 
    com.nome.toLowerCase().includes(busca.toLowerCase()) ||
    com.localizacao.toLowerCase().includes(busca.toLowerCase())
  );

  const comunidadesVirtuaisFiltradas = comunidadesVirtuais.filter(com =>
    busca === "" ||
    com.nome.toLowerCase().includes(busca.toLowerCase()) ||
    com.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-amber-900">
                Comunidades
              </h1>
              <p className="text-amber-700">
                Redes de sabedoria e resistência coletiva
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-600" />
            <Input
              placeholder="Buscar comunidades..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 border-amber-300 focus:border-amber-500"
            />
          </div>
        </motion.div>

        {/* Comunidades Virtuais */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Comunidades Virtuais</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comunidadesVirtuaisFiltradas.map((com, index) => (
              <motion.div
                key={com.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white/80 border-2 border-purple-200 hover:border-purple-400 transition-all">
                  <CardHeader>
                    <CardTitle className="text-purple-900 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {com.nome}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-4">{com.descricao}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="border-purple-300 text-purple-800">
                        {com.membros?.length || 0} membros
                      </Badge>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <UserPlus className="w-4 h-4 mr-1" />
                        Participar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comunidades Territoriais */}
        <div>
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Comunidades Territoriais</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comunidadesFiltradas.map((com, index) => (
              <motion.div
                key={com.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white/80 border-2 border-emerald-200 hover:border-emerald-400 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{territorioEmojis[com.tipo_territorio]}</span>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                        {com.tipo_territorio}
                      </Badge>
                    </div>
                    <CardTitle className="text-emerald-900">{com.nome}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-amber-700 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{com.localizacao}</span>
                    </div>
                    {com.descricao && (
                      <p className="text-sm text-gray-700 line-clamp-3">{com.descricao}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}