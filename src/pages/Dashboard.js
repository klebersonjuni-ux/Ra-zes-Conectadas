import React, { useState, useEffect } from "react";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Users, MapPin, Clock, Plus, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import SaberCard from "../components/dashboard/SaberCard";
import CirculoTemporal from "../components/dashboard/CirculoTemporal";
import ConexoesTerritorio from "../components/dashboard/ConexoesTerritorio";

export default function Dashboard() {
  const [saberes, setSaberes] = useState([]);
  const [comunidades, setComunidades] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tempoAtual, setTempoAtual] = useState("presente");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [currentUser, saberesData, comunidadesData] = await Promise.all([
        api.auth.me(), 
        api.entities.Saber.list("-created_date", 20), 
        api.entities.Comunidade.list("-created_date", 10) 
      ]);
      setUser(currentUser);
      setSaberes(saberesData);
      setComunidades(comunidadesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const saberesFiltrados = saberes.filter(saber => 
    tempoAtual === "presente" || saber.tempo_circular === tempoAtual
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho Orgânico */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-amber-700 bg-clip-text text-transparent">
              Círculo de Saberes
            </h1>
            <p className="text-lg text-amber-800 max-w-2xl mx-auto leading-relaxed">
              Onde a sabedoria ancestral flui em círculos, conectando territórios e fortalecendo o bem viver coletivo
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                {comunidades.length} Comunidades Conectadas
              </Badge>
              <Badge className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border border-orange-200 px-4 py-2">
                <Mic className="w-4 h-4 mr-2" />
                {saberes.length} Saberes Compartilhados
              </Badge>
            </div>
          </motion.div>
        </div>

        {/* Layout em Grade Orgânica */}
        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          {/* Círculo Temporal - Card Principal */}
          <div className="lg:col-span-5">
            <CirculoTemporal 
              tempoAtual={tempoAtual}
              setTempoAtual={setTempoAtual}
              saberes={saberes}
            />
          </div>

          {/* Conexões de Território */}
          <div className="lg:col-span-7">
            <ConexoesTerritorio 
              comunidades={comunidades}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Feed de Saberes em Formato Orgânico */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-amber-900 mb-2">
                Saberes do {tempoAtual === "presente" ? "Tempo Presente" : tempoAtual.replace("_", " ")}
              </h2>
              <p className="text-amber-700">
                Conhecimentos que fluem pela rede de territórios ancestrais
              </p>
            </div>
            <Button 
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Compartilhar Saber
            </Button>
          </div>

          {/* Grade de Saberes */}
          <AnimatePresence>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse bg-white/50">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                saberesFiltrados.map((saber, index) => (
                  <SaberCard 
                    key={saber.id} 
                    saber={saber} 
                    index={index}
                    user={user}
                    onUpdate={loadData}
                  />
                ))
              )}
            </div>
          </AnimatePresence>

          {saberesFiltrados.length === 0 && !isLoading && (
            <Card className="text-center py-12 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
              <CardContent>
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-amber-900">
                    Nenhum saber neste tempo circular
                  </h3>
                  <p className="text-amber-700">
                    Os saberes fluem em diferentes momentos. Explore outros tempos ou compartilhe conhecimentos deste período.
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                    onClick={() => setTempoAtual("presente")}
                  >
                    Voltar ao Presente
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}