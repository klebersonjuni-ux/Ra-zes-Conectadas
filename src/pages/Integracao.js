import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, Users, Heart, ArrowRight, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [comunidadePadrao, setComunidadePadrao] = useState(null);
  
  const [formData, setFormData] = useState({
    tipo_participante: "",
    povo_origem: "",
    territorio_origem: "",
    localizacao: "",
    apresentacao: "",
    criar_comunidade: false,
    nova_comunidade: {
      nome: "",
      descricao: "",
      temas: []
    }
  });

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const currentUser = await base44.auth.me();
        
        if (!isMounted) return;
        
        setUser(currentUser);
        
        // Se já completou onboarding, redirecionar para Dashboard
        if (currentUser.onboarding_completo) {
          navigate(createPageUrl("Dashboard"), { replace: true });
          return;
        }
        
        // Buscar comunidade padrão
        const comunidades = await base44.entities.ComunidadeVirtual.filter({ comunidade_padrao: true });
        if (comunidades.length > 0 && isMounted) {
          setComunidadePadrao(comunidades[0]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Atualizar dados do usuário
      const updateData = {
        tipo_participante: formData.tipo_participante,
        povo_origem: formData.povo_origem || null,
        territorio_origem: formData.territorio_origem || null,
        localizacao: formData.localizacao || null,
        apresentacao: formData.apresentacao || null,
        onboarding_completo: true,
        comunidades_participantes: comunidadePadrao ? [comunidadePadrao.id] : []
      };
      
      await base44.auth.updateMe(updateData);
      
      // Adicionar à comunidade padrão
      if (comunidadePadrao) {
        const novosMembros = [...(comunidadePadrao.membros || []), user.email];
        await base44.entities.ComunidadeVirtual.update(comunidadePadrao.id, {
          membros: novosMembros
        });
      }
      
      // Criar nova comunidade se solicitado
      if (formData.criar_comunidade && formData.nova_comunidade.nome) {
        await base44.entities.ComunidadeVirtual.create({
          nome: formData.nova_comunidade.nome,
          descricao: formData.nova_comunidade.descricao,
          tipo: "tematica",
          criador_email: user.email,
          membros: [user.email],
          temas_principais: formData.nova_comunidade.temas || []
        });
      }
      
      navigate(createPageUrl("Dashboard"), { replace: true });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-amber-800 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <style>
        {`
          .terra-gradient {
            background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
          }
        `}
      </style>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 terra-gradient rounded-full flex items-center justify-center mx-auto mb-4 transform rotate-12">
            <Leaf className="w-10 h-10 text-amber-50 transform -rotate-12" />
          </div>
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Bem-vindo(a) ao Raízes</h1>
          <p className="text-lg text-amber-700">
            Uma rede de saberes ancestrais e conexões territoriais
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-2 border-amber-200 shadow-2xl">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step >= s
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <span className="text-sm text-amber-700">Passo {step} de 3</span>
            </div>
            <CardTitle className="text-2xl text-amber-900">
              {step === 1 && "Auto-declaração"}
              {step === 2 && "Sua História"}
              {step === 3 && "Comunidade Virtual"}
            </CardTitle>
            <CardDescription className="text-amber-700">
              {step === 1 && "Como você se identifica nesta rede de saberes?"}
              {step === 2 && "Compartilhe um pouco sobre sua jornada e território"}
              {step === 3 && "Junte-se e crie comunidades virtuais"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Passo 1: Auto-declaração */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label className="text-amber-900 font-semibold">
                    Como você se identifica? *
                  </Label>
                  <RadioGroup
                    value={formData.tipo_participante}
                    onValueChange={(value) => setFormData({ ...formData, tipo_participante: value })}
                  >
                    <div className="flex items-center space-x-3 p-4 border-2 border-amber-200 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer">
                      <RadioGroupItem value="povo_tradicional" id="povo" />
                      <Label htmlFor="povo" className="cursor-pointer flex-1">
                        <div className="font-semibold text-amber-900">Povo Tradicional</div>
                        <div className="text-sm text-amber-700">
                          Pertenço a um povo indígena, quilombola ou comunidade tradicional
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border-2 border-amber-200 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer">
                      <RadioGroupItem value="comunidade_tradicional" id="comunidade" />
                      <Label htmlFor="comunidade" className="cursor-pointer flex-1">
                        <div className="font-semibold text-amber-900">Comunidade Tradicional</div>
                        <div className="text-sm text-amber-700">
                          Faço parte de uma comunidade ribeirinha, pesqueira, rural ou periférica
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border-2 border-amber-200 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer">
                      <RadioGroupItem value="simpatizante" id="simpatizante" />
                      <Label htmlFor="simpatizante" className="cursor-pointer flex-1">
                        <div className="font-semibold text-amber-900">Simpatizante</div>
                        <div className="text-sm text-amber-700">
                          Apoio e valorizo os saberes e lutas dos povos e comunidades tradicionais
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!formData.tipo_participante}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Passo 2: História */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {(formData.tipo_participante === "povo_tradicional" || 
                  formData.tipo_participante === "comunidade_tradicional") && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="povo_origem" className="text-amber-900 font-semibold">
                        Nome do seu Povo ou Comunidade
                      </Label>
                      <Input
                        id="povo_origem"
                        value={formData.povo_origem}
                        onChange={(e) => setFormData({ ...formData, povo_origem: e.target.value })}
                        placeholder="Ex: Povo Pataxó, Quilombo do Cedro..."
                        className="border-amber-200 focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="territorio" className="text-amber-900 font-semibold">
                        Tipo de Território
                      </Label>
                      <Select
                        value={formData.territorio_origem}
                        onValueChange={(value) => setFormData({ ...formData, territorio_origem: value })}
                      >
                        <SelectTrigger className="border-amber-200">
                          <SelectValue placeholder="Selecione o território" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quilombo">Quilombo</SelectItem>
                          <SelectItem value="aldeia">Aldeia</SelectItem>
                          <SelectItem value="periferia">Periferia</SelectItem>
                          <SelectItem value="floresta">Floresta</SelectItem>
                          <SelectItem value="campo">Campo</SelectItem>
                          <SelectItem value="rio">Rio</SelectItem>
                          <SelectItem value="montanha">Montanha</SelectItem>
                          <SelectItem value="cidade">Cidade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="localizacao" className="text-amber-900 font-semibold">
                    Localização
                  </Label>
                  <Input
                    id="localizacao"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    placeholder="Cidade, Estado ou Região"
                    className="border-amber-200 focus:border-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apresentacao" className="text-amber-900 font-semibold">
                    Sua Apresentação
                  </Label>
                  <Textarea
                    id="apresentacao"
                    value={formData.apresentacao}
                    onChange={(e) => setFormData({ ...formData, apresentacao: e.target.value })}
                    placeholder="Conte um pouco sobre você, seus saberes, sua trajetória..."
                    rows={4}
                    className="border-amber-200 focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="border-amber-300 text-amber-700"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Passo 3: Comunidade */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {comunidadePadrao && (
                  <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200">
                    <CardHeader>
                      <CardTitle className="text-emerald-900 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {comunidadePadrao.nome}
                      </CardTitle>
                      <CardDescription className="text-emerald-700">
                        {comunidadePadrao.descricao}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-emerald-800">
                        <Heart className="w-4 h-4" />
                        <span>Você será automaticamente conectado(a) a esta comunidade</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="border-2 border-dashed border-amber-300 rounded-xl p-6 bg-amber-50/50">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-amber-900 mb-1">
                        Criar uma Nova Comunidade Virtual
                      </h3>
                      <p className="text-sm text-amber-700 mb-4">
                        Você pode criar um espaço para reunir pessoas com interesses comuns
                      </p>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <input
                          type="checkbox"
                          id="criar_comunidade"
                          checked={formData.criar_comunidade}
                          onChange={(e) => setFormData({ ...formData, criar_comunidade: e.target.checked })}
                          className="w-4 h-4 text-amber-600"
                        />
                        <Label htmlFor="criar_comunidade" className="cursor-pointer text-amber-800">
                          Quero criar minha própria comunidade
                        </Label>
                      </div>

                      {formData.criar_comunidade && (
                        <div className="space-y-3 mt-4">
                          <Input
                            placeholder="Nome da comunidade"
                            value={formData.nova_comunidade.nome}
                            onChange={(e) => setFormData({
                              ...formData,
                              nova_comunidade: { ...formData.nova_comunidade, nome: e.target.value }
                            })}
                            className="border-amber-300"
                          />
                          <Textarea
                            placeholder="Descrição e propósito da comunidade"
                            value={formData.nova_comunidade.descricao}
                            onChange={(e) => setFormData({
                              ...formData,
                              nova_comunidade: { ...formData.nova_comunidade, descricao: e.target.value }
                            })}
                            rows={3}
                            className="border-amber-300"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="border-amber-300 text-amber-700"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  >
                    {loading ? "Salvando..." : "Entrar no Raízes"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-amber-700 mt-6">
          Ao continuar, você se compromete a respeitar os saberes e territórios ancestrais
        </p>
      </motion.div>
    </div>
  );
}