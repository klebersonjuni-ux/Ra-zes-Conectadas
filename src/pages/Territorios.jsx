import React, { useState, useEffect } from "react";
import { api } from "@/api"; // Importação correta
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Search, Filter, Users, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Fix do ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const territorioColors = {
  quilombo: "#9333ea",
  aldeia: "#059669",
  periferia: "#ea580c",
  floresta: "#10b981",
  campo: "#eab308",
  cidade: "#3b82f6",
  rio: "#06b6d4",
  montanha: "#6b7280"
};

const territorioIcons = {
  quilombo: "🏘️",
  aldeia: "🌳",
  periferia: "🏢",
  floresta: "🌲",
  campo: "🌾",
  cidade: "🏙️",
  rio: "🏞️",
  montanha: "⛰️"
};

// Componente para criar ícones customizados
const createCustomIcon = (tipo) => {
  const color = territorioColors[tipo] || "#8B4513";
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 16px;
        ">${territorioIcons[tipo] || "📍"}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export default function Territorios() {
  const [comunidades, setComunidades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busca, setBusca] = useState("");
  const [selectedComunidade, setSelectedComunidade] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadComunidades();
  }, []);

  const loadComunidades = async () => {
    setIsLoading(true);
    try {
      // CORREÇÃO: Usando api.entities em vez de base44.entities
      const data = await api.entities.Comunidade.list("-created_date");
      setComunidades(data);
    } catch (error) {
      console.error("Erro ao carregar comunidades:", error);
    }
    setIsLoading(false);
  };

  const comunidadesFiltradas = comunidades.filter(com => {
    const matchTipo = filtroTipo === "todos" || com.tipo_territorio === filtroTipo;
    const matchBusca = busca === "" || 
      com.nome.toLowerCase().includes(busca.toLowerCase()) ||
      com.localizacao.toLowerCase().includes(busca.toLowerCase()) ||
      (com.regioes || []).some(r => 
        r.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        r.cidade?.toLowerCase().includes(busca.toLowerCase()) ||
        r.estado?.toLowerCase().includes(busca.toLowerCase())
      );
    return matchTipo && matchBusca;
  });

  // Coletar todos os marcadores do mapa
  const marcadores = [];
  comunidadesFiltradas.forEach(comunidade => {
    if (comunidade.regioes && comunidade.regioes.length > 0) {
      comunidade.regioes.forEach(regiao => {
        if (regiao.latitude && regiao.longitude) {
          marcadores.push({
            ...regiao,
            comunidade: comunidade
          });
        }
      });
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-amber-900">
                Mapa de Territórios Ancestrais
              </h1>
              <p className="text-amber-700">
                Visualize e conecte-se com povos e comunidades em todo Brasil
              </p>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-600" />
              <Input
                placeholder="Buscar por nome, região, cidade..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 border-amber-300 focus:border-amber-500"
              />
            </div>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="border-amber-300">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Territórios</SelectItem>
                <SelectItem value="quilombo">Quilombos</SelectItem>
                <SelectItem value="aldeia">Aldeias</SelectItem>
                <SelectItem value="periferia">Periferias</SelectItem>
                <SelectItem value="floresta">Florestas</SelectItem>
                <SelectItem value="campo">Campos</SelectItem>
                <SelectItem value="rio">Rios</SelectItem>
                <SelectItem value="cidade">Cidades</SelectItem>
                <SelectItem value="montanha">Montanhas</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Marcar Território
            </Button>
          </div>
        </motion.div>

        {/* Layout Grid: Mapa + Lista */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Mapa Principal */}
          <Card className="lg:col-span-2 overflow-hidden border-2 border-amber-200 shadow-xl">
            <CardContent className="p-0 h-[600px]">
              <MapContainer
                center={[-15.7801, -47.9292]} // Centro do Brasil (Brasília)
                zoom={4}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {marcadores.map((marcador, index) => (
                  <Marker
                    key={`${marcador.comunidade.id}-${index}`}
                    position={[marcador.latitude, marcador.longitude]}
                    icon={createCustomIcon(marcador.comunidade.tipo_territorio)}
                    eventHandlers={{
                      click: () => setSelectedComunidade(marcador.comunidade)
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{territorioIcons[marcador.comunidade.tipo_territorio]}</span>
                          <h3 className="font-bold text-amber-900">{marcador.comunidade.nome}</h3>
                        </div>
                        <p className="text-sm text-amber-800 mb-1">
                          <strong>Região:</strong> {marcador.nome}
                        </p>
                        {marcador.cidade && (
                          <p className="text-sm text-amber-700">
                            {marcador.cidade}, {marcador.estado}
                          </p>
                        )}
                        <Badge 
                          className="mt-2"
                          style={{ 
                            backgroundColor: `${territorioColors[marcador.comunidade.tipo_territorio]}20`,
                            color: territorioColors[marcador.comunidade.tipo_territorio],
                            border: `1px solid ${territorioColors[marcador.comunidade.tipo_territorio]}`
                          }}
                        >
                          {marcador.comunidade.tipo_territorio}
                        </Badge>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </CardContent>
          </Card>

          {/* Lista de Comunidades */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Comunidades no Mapa
                </CardTitle>
                <p className="text-sm text-amber-700">
                  {comunidadesFiltradas.length} territórios encontrados
                </p>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto space-y-3">
                <AnimatePresence>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-amber-700 mt-4">Carregando territórios...</p>
                    </div>
                  ) : comunidadesFiltradas.length === 0 ? (
                    <div className="text-center py-8">
                      <Leaf className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                      <p className="text-amber-800 font-medium">Nenhum território encontrado</p>
                      <p className="text-amber-600 text-sm">Tente ajustar os filtros</p>
                    </div>
                  ) : (
                    comunidadesFiltradas.map((comunidade, index) => (
                      <motion.div
                        key={comunidade.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            selectedComunidade?.id === comunidade.id 
                              ? 'border-2 border-amber-500 bg-amber-50' 
                              : 'border border-amber-200 hover:border-amber-400'
                          }`}
                          onClick={() => setSelectedComunidade(comunidade)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${territorioColors[comunidade.tipo_territorio]}30` }}
                              >
                                <span className="text-xl">{territorioIcons[comunidade.tipo_territorio]}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-amber-900 truncate">{comunidade.nome}</h4>
                                <p className="text-sm text-amber-700 truncate">{comunidade.localizacao}</p>
                                {comunidade.regioes && comunidade.regioes.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {comunidade.regioes.slice(0, 2).map((regiao, idx) => (
                                      <Badge 
                                        key={idx} 
                                        variant="outline" 
                                        className="text-xs border-amber-300 text-amber-800"
                                      >
                                        {regiao.nome || regiao.cidade}
                                      </Badge>
                                    ))}
                                    {comunidade.regioes.length > 2 && (
                                      <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                                        +{comunidade.regioes.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Detalhes da Comunidade Selecionada */}
            {selectedComunidade && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-white border-2 border-amber-300 shadow-xl">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${territorioColors[selectedComunidade.tipo_territorio]}30` }}
                        >
                          <span className="text-2xl">{territorioIcons[selectedComunidade.tipo_territorio]}</span>
                        </div>
                        <div>
                          <CardTitle className="text-amber-900">{selectedComunidade.nome}</CardTitle>
                          <p className="text-sm text-amber-700">{selectedComunidade.localizacao}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedComunidade(null)}
                        className="text-amber-600"
                      >
                        ✕
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedComunidade.descricao && (
                      <p className="text-sm text-amber-800 leading-relaxed">
                        {selectedComunidade.descricao}
                      </p>
                    )}

                    {selectedComunidade.regioes && selectedComunidade.regioes.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Regiões de Atuação
                        </h4>
                        <div className="space-y-2">
                          {selectedComunidade.regioes.map((regiao, idx) => (
                            <div 
                              key={idx}
                              className="p-3 bg-amber-50 rounded-lg border border-amber-200"
                            >
                              <p className="font-medium text-amber-900">{regiao.nome}</p>
                              {regiao.cidade && (
                                <p className="text-sm text-amber-700">{regiao.cidade}, {regiao.estado}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedComunidade.liderancas && selectedComunidade.liderancas.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2">Lideranças</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedComunidade.liderancas.map((lideranca, idx) => (
                            <Badge key={idx} variant="outline" className="border-amber-300 text-amber-800">
                              {lideranca}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Legenda */}
        <Card className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-amber-900 mb-3">Legenda dos Territórios</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {Object.entries(territorioIcons).map(([tipo, icon]) => (
                <div key={tipo} className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                    style={{ backgroundColor: territorioColors[tipo] }}
                  >
                    <span>{icon}</span>
                  </div>
                  <span className="text-sm text-amber-800 capitalize">{tipo}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}