import React, { useState, useEffect } from "react";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Send, Plus, X } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function EditorCartaAberta({ carta, user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    titulo: carta?.titulo || "",
    conteudo: carta?.conteudo || "",
    autor_nome: carta?.autor_nome || user?.full_name || "",
    autor_email: user?.email || "",
    comunidade_origem: carta?.comunidade_origem || user?.povo_origem || "",
    territorio_origem: carta?.territorio_origem || user?.territorio_origem || "",
    destinatarios: carta?.destinatarios || [],
    temas: carta?.temas || [],
    visibilidade: carta?.visibilidade || "publica",
    status: carta?.status || "rascunho"
  });

  const [novoDestinatario, setNovoDestinatario] = useState("");
  const [novoTema, setNovoTema] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const adicionarDestinatario = () => {
    if (novoDestinatario && !formData.destinatarios.includes(novoDestinatario)) {
      setFormData({
        ...formData,
        destinatarios: [...formData.destinatarios, novoDestinatario]
      });
      setNovoDestinatario("");
    }
  };

  const removerDestinatario = (dest) => {
    setFormData({
      ...formData,
      destinatarios: formData.destinatarios.filter(d => d !== dest)
    });
  };

  const adicionarTema = () => {
    if (novoTema && !formData.temas.includes(novoTema)) {
      setFormData({
        ...formData,
        temas: [...formData.temas, novoTema]
      });
      setNovoTema("");
    }
  };

  const removerTema = (tema) => {
    setFormData({
      ...formData,
      temas: formData.temas.filter(t => t !== tema)
    });
  };

  const handleSave = async (publicar = false) => {
    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        status: publicar ? "publicada" : formData.status,
        data_publicacao: publicar && !carta?.data_publicacao ? new Date().toISOString().split('T')[0] : carta?.data_publicacao
      };

      if (carta) {
        await base44.entities.CartaAberta.update(carta.id, dataToSave);
      } else {
        await base44.entities.CartaAberta.create(dataToSave);
      }

      onSave();
    } catch (error) {
      console.error("Erro ao salvar carta:", error);
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="border-purple-300 text-purple-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-purple-900">
              {carta ? "Editar Carta Aberta" : "Nova Carta Aberta"}
            </h1>
            <p className="text-purple-700">
              Expresse sua voz, compartilhe sua verdade
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Editor Principal */}
          <Card className="lg:col-span-2 border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900">Conteúdo da Carta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="titulo" className="text-purple-900 font-semibold">
                  Título *
                </Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Dê um título impactante para sua carta"
                  className="border-purple-300 focus:border-purple-500 text-lg font-medium"
                />
              </div>

              <div>
                <Label className="text-purple-900 font-semibold mb-2 block">
                  Conteúdo *
                </Label>
                <ReactQuill
                  theme="snow"
                  value={formData.conteudo}
                  onChange={(value) => setFormData({ ...formData, conteudo: value })}
                  placeholder="Escreva sua carta aberta aqui..."
                  className="bg-white rounded-lg border-2 border-purple-200"
                  style={{ minHeight: "400px" }}
                />
              </div>

              {/* Destinatários */}
              <div>
                <Label className="text-purple-900 font-semibold mb-2 block">
                  Para quem é direcionada esta carta?
                </Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={novoDestinatario}
                    onChange={(e) => setNovoDestinatario(e.target.value)}
                    placeholder="Ex: Governo Federal, Sociedade..."
                    className="border-purple-300"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarDestinatario())}
                  />
                  <Button
                    type="button"
                    onClick={adicionarDestinatario}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.destinatarios.map((dest, idx) => (
                    <Badge 
                      key={idx} 
                      className="bg-purple-100 text-purple-800 border-purple-300 pr-1"
                    >
                      {dest}
                      <button
                        onClick={() => removerDestinatario(dest)}
                        className="ml-2 hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Temas */}
              <div>
                <Label className="text-purple-900 font-semibold mb-2 block">
                  Temas abordados
                </Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={novoTema}
                    onChange={(e) => setNovoTema(e.target.value)}
                    placeholder="Ex: Demarcação, Saúde, Educação..."
                    className="border-purple-300"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarTema())}
                  />
                  <Button
                    type="button"
                    onClick={adicionarTema}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.temas.map((tema, idx) => (
                    <Badge 
                      key={idx} 
                      className="bg-pink-100 text-pink-800 border-pink-300 pr-1"
                    >
                      {tema}
                      <button
                        onClick={() => removerTema(tema)}
                        className="ml-2 hover:text-pink-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Painel Lateral */}
          <div className="space-y-6">
            {/* Informações do Autor */}
            <Card className="border-2 border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900 text-lg">Informações do Autor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="autor_nome" className="text-amber-900">Nome</Label>
                  <Input
                    id="autor_nome"
                    value={formData.autor_nome}
                    onChange={(e) => setFormData({ ...formData, autor_nome: e.target.value })}
                    className="border-amber-300"
                  />
                </div>

                <div>
                  <Label htmlFor="comunidade" className="text-amber-900">Comunidade/Povo</Label>
                  <Input
                    id="comunidade"
                    value={formData.comunidade_origem}
                    onChange={(e) => setFormData({ ...formData, comunidade_origem: e.target.value })}
                    placeholder="Seu povo ou comunidade"
                    className="border-amber-300"
                  />
                </div>

                <div>
                  <Label htmlFor="territorio" className="text-amber-900">Território</Label>
                  <Input
                    id="territorio"
                    value={formData.territorio_origem}
                    onChange={(e) => setFormData({ ...formData, territorio_origem: e.target.value })}
                    placeholder="Seu território"
                    className="border-amber-300"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configurações */}
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-900 text-lg">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="visibilidade" className="text-orange-900">Visibilidade</Label>
                  <Select
                    value={formData.visibilidade}
                    onValueChange={(value) => setFormData({ ...formData, visibilidade: value })}
                  >
                    <SelectTrigger className="border-orange-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="publica">Pública - Todos podem ver</SelectItem>
                      <SelectItem value="comunidade">Comunidade - Só membros</SelectItem>
                      <SelectItem value="privada">Privada - Só você</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-4 space-y-3">
                <Button
                  onClick={() => handleSave(false)}
                  disabled={isSaving || !formData.titulo || !formData.conteudo}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Salvando..." : "Salvar Rascunho"}
                </Button>

                <Button
                  onClick={() => handleSave(true)}
                  disabled={isSaving || !formData.titulo || !formData.conteudo}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSaving ? "Publicando..." : "Publicar Carta"}
                </Button>

                <p className="text-xs text-center text-gray-600 mt-2">
                  {formData.status === "publicada" 
                    ? "Carta já publicada - mudanças serão salvas"
                    : "Publique quando estiver pronto para compartilhar"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}