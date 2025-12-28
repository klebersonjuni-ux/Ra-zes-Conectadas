import React, { useState } from "react";
import { api } from "@/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function MarcarTerritorioModal({ comunidade, onClose, onSave }) {
  const [regioes, setRegioes] = useState(comunidade?.regioes || []);
  const [novaRegiao, setNovaRegiao] = useState({
    nome: "",
    cidade: "",
    estado: "",
    latitude: "",
    longitude: ""
  });

  const adicionarRegiao = () => {
    if (novaRegiao.nome || novaRegiao.cidade) {
      setRegioes([...regioes, {
        ...novaRegiao,
        latitude: novaRegiao.latitude ? parseFloat(novaRegiao.latitude) : null,
        longitude: novaRegiao.longitude ? parseFloat(novaRegiao.longitude) : null
      }]);
      setNovaRegiao({
        nome: "",
        cidade: "",
        estado: "",
        latitude: "",
        longitude: ""
      });
    }
  };

  const removerRegiao = (index) => {
    setRegioes(regioes.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await base44.entities.Comunidade.update(comunidade.id, { regioes });
      onSave();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar regiões:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-amber-900 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Marcar Territórios - {comunidade?.nome}
          </DialogTitle>
          <DialogDescription className="text-amber-700">
            Adicione as regiões onde sua comunidade está presente. Você pode adicionar várias regiões.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Regiões Existentes */}
          {regioes.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-amber-900">Regiões Cadastradas</h4>
              {regioes.map((regiao, index) => (
                <Card key={index} className="bg-amber-50 border-amber-200">
                  <CardContent className="p-3 flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-amber-900">{regiao.nome}</p>
                      {regiao.cidade && (
                        <p className="text-sm text-amber-700">{regiao.cidade}, {regiao.estado}</p>
                      )}
                      {regiao.latitude && regiao.longitude && (
                        <p className="text-xs text-amber-600 mt-1">
                          Coords: {regiao.latitude}, {regiao.longitude}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removerRegiao(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Adicionar Nova Região */}
          <div className="border-2 border-dashed border-amber-300 rounded-lg p-4 bg-amber-50/50">
            <h4 className="font-semibold text-amber-900 mb-4">Adicionar Nova Região</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome_regiao" className="text-amber-900">
                  Nome da Região *
                </Label>
                <Input
                  id="nome_regiao"
                  value={novaRegiao.nome}
                  onChange={(e) => setNovaRegiao({ ...novaRegiao, nome: e.target.value })}
                  placeholder="Ex: Norte de Minas, Vale do Jequitinhonha..."
                  className="border-amber-300"
                />
                <p className="text-xs text-amber-600 mt-1">
                  Nome popular da região onde sua comunidade está presente
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cidade" className="text-amber-900">
                    Cidade
                  </Label>
                  <Input
                    id="cidade"
                    value={novaRegiao.cidade}
                    onChange={(e) => setNovaRegiao({ ...novaRegiao, cidade: e.target.value })}
                    placeholder="Ex: Belo Horizonte"
                    className="border-amber-300"
                  />
                </div>
                <div>
                  <Label htmlFor="estado" className="text-amber-900">
                    Estado
                  </Label>
                  <Input
                    id="estado"
                    value={novaRegiao.estado}
                    onChange={(e) => setNovaRegiao({ ...novaRegiao, estado: e.target.value })}
                    placeholder="Ex: MG"
                    className="border-amber-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude" className="text-amber-900">
                    Latitude (opcional)
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={novaRegiao.latitude}
                    onChange={(e) => setNovaRegiao({ ...novaRegiao, latitude: e.target.value })}
                    placeholder="-19.9167"
                    className="border-amber-300"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude" className="text-amber-900">
                    Longitude (opcional)
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={novaRegiao.longitude}
                    onChange={(e) => setNovaRegiao({ ...novaRegiao, longitude: e.target.value })}
                    placeholder="-43.9345"
                    className="border-amber-300"
                  />
                </div>
              </div>

              <Button
                onClick={adicionarRegiao}
                disabled={!novaRegiao.nome && !novaRegiao.cidade}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Região
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="border-amber-300 text-amber-700">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={regioes.length === 0}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
          >
            Salvar Territórios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}