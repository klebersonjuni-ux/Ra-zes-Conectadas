import React, { useState, useEffect } from "react";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Plus, Search, Heart, Edit, Trash2, Eye, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import CartaAbertaCard from "../components/cartas/CartaAbertaCard";
import EditorCartaAberta from "../components/cartas/EditorCartaAberta";
import VisualizadorCartaAberta from "../components/cartas/VisualizadorCartaAberta";

export default function CartasAbertas() {
  const [cartas, setCartas] = useState([]);
  const [minhasCartas, setMinhasCartas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [busca, setBusca] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [cartaEditando, setCartaEditando] = useState(null);
  const [cartaVisualizando, setCartaVisualizando] = useState(null);
  const [activeTab, setActiveTab] = useState("todas");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const todasCartas = await base44.entities.CartaAberta.list("-created_date");
      const cartasPublicas = todasCartas.filter(c => c.status === "publicada" && c.visibilidade === "publica");
      const minhas = todasCartas.filter(c => c.autor_email === currentUser.email);

      setCartas(cartasPublicas);
      setMinhasCartas(minhas);
    } catch (error) {
      console.error("Erro ao carregar cartas:", error);
    }
    setIsLoading(false);
  };

  const handleNovaCarta = () => {
    setCartaEditando(null);
    setShowEditor(true);
  };

  const handleEditarCarta = (carta) => {
    setCartaEditando(carta);
    setShowEditor(true);
  };

  const handleDeletarCarta = async (carta) => {
    if (confirm("Tem certeza que deseja excluir esta carta?")) {
      try {
        await base44.entities.CartaAberta.delete(carta.id);
        await loadData();
      } catch (error) {
        console.error("Erro ao deletar carta:", error);
      }
    }
  };

  const handleApoiar = async (carta) => {
    try {
      const apoios = carta.apoios || [];
      if (!apoios.includes(user.email)) {
        await base44.entities.CartaAberta.update(carta.id, {
          apoios: [...apoios, user.email]
        });
        await loadData();
      }
    } catch (error) {
      console.error("Erro ao apoiar carta:", error);
    }
  };

  const cartasFiltradas = (activeTab === "minhas" ? minhasCartas : cartas).filter(carta =>
    carta.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    carta.conteudo.toLowerCase().includes(busca.toLowerCase()) ||
    (carta.temas || []).some(tema => tema.toLowerCase().includes(busca.toLowerCase()))
  );

  if (showEditor) {
    return (
      <EditorCartaAberta
        carta={cartaEditando}
        user={user}
        onClose={() => {
          setShowEditor(false);
          setCartaEditando(null);
        }}
        onSave={async () => {
          await loadData();
          setShowEditor(false);
          setCartaEditando(null);
        }}
      />
    );
  }

  if (cartaVisualizando) {
    return (
      <VisualizadorCartaAberta
        carta={cartaVisualizando}
        user={user}
        onClose={() => setCartaVisualizando(null)}
        onApoiar={() => handleApoiar(cartaVisualizando)}
        onEditar={() => {
          setCartaEditando(cartaVisualizando);
          setCartaVisualizando(null);
          setShowEditor(true);
        }}
        onDeletar={() => {
          handleDeletarCarta(cartaVisualizando);
          setCartaVisualizando(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center transform rotate-3">
                <FileText className="w-7 h-7 text-white transform -rotate-3" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-amber-900">
                  Cartas Abertas
                </h1>
                <p className="text-amber-700">
                  Espaço de expressão e resistência dos povos e comunidades
                </p>
              </div>
            </div>

            <Button
              onClick={handleNovaCarta}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Escrever Nova Carta
            </Button>
          </div>

          {/* Busca e Filtros */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-600" />
              <Input
                placeholder="Buscar por título, conteúdo ou tema..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 border-amber-300 focus:border-amber-500"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="bg-amber-100">
                <TabsTrigger value="todas">Todas as Cartas</TabsTrigger>
                <TabsTrigger value="minhas">Minhas Cartas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        {/* Card de Boas-vindas */}
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Bem-vindo(a) à Comunidade Carta Aberta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-800 leading-relaxed">
              Este é um espaço sagrado de expressão livre onde povos e comunidades tradicionais, 
              junto a seus simpatizantes, podem manifestar suas vozes, denúncias, reivindicações 
              e esperanças. Aqui, cada palavra é um ato de resistência e afirmação da existência digna.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                Liberdade de Expressão
              </Badge>
              <Badge className="bg-pink-100 text-pink-800 border-pink-300">
                Respeito Mútuo
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                Resistência Coletiva
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Grade de Cartas */}
        <AnimatePresence>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-amber-700">Carregando cartas abertas...</p>
            </div>
          ) : cartasFiltradas.length === 0 ? (
            <Card className="text-center py-12 bg-white border-2 border-amber-200">
              <CardContent>
                <FileText className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  {activeTab === "minhas" ? "Você ainda não escreveu nenhuma carta" : "Nenhuma carta encontrada"}
                </h3>
                <p className="text-amber-700 mb-4">
                  {activeTab === "minhas" 
                    ? "Compartilhe suas reflexões, denúncias ou esperanças com a comunidade"
                    : "Seja o primeiro a compartilhar sua voz neste espaço"}
                </p>
                {activeTab === "minhas" && (
                  <Button
                    onClick={handleNovaCarta}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Escrever Primeira Carta
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cartasFiltradas.map((carta, index) => (
                <CartaAbertaCard
                  key={carta.id}
                  carta={carta}
                  index={index}
                  user={user}
                  onView={() => setCartaVisualizando(carta)}
                  onEdit={() => handleEditarCarta(carta)}
                  onDelete={() => handleDeletarCarta(carta)}
                  onApoiar={() => handleApoiar(carta)}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Estatísticas */}
        {!isLoading && (
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-purple-900">{cartas.length}</p>
                <p className="text-sm text-purple-700">Cartas Publicadas</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-200">
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-pink-900">
                  {cartas.reduce((sum, c) => sum + (c.apoios?.length || 0), 0)}
                </p>
                <p className="text-sm text-pink-700">Apoios Recebidos</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
              <CardContent className="p-6 text-center">
                <Edit className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-orange-900">{minhasCartas.length}</p>
                <p className="text-sm text-orange-700">Suas Cartas</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}