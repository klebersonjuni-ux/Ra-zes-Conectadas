import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Edit, Trash2, Share2, Calendar, User, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

export default function VisualizadorCartaAberta({ carta, user, onClose, onApoiar, onEditar, onDeletar }) {
  const isAutor = user?.email === carta.autor_email;
  const jaApoiou = (carta.apoios || []).includes(user?.email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-purple-300 text-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="flex items-center gap-2">
            {!isAutor && carta.status === "publicada" && (
              <Button
                onClick={onApoiar}
                disabled={jaApoiou}
                className={`${
                  jaApoiou
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "bg-white hover:bg-pink-50 text-pink-600 border-2 border-pink-300"
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${jaApoiou ? "fill-current" : ""}`} />
                {jaApoiou ? "Apoiado" : "Apoiar"} ({carta.apoios?.length || 0})
              </Button>
            )}

            {isAutor && (
              <>
                <Button
                  variant="outline"
                  onClick={onEditar}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  onClick={onDeletar}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </>
            )}

            <Button
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>

        {/* Carta */}
        <Card className="border-2 border-purple-200 shadow-2xl">
          <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex justify-between items-start mb-4">
              <Badge className="bg-green-100 text-green-800 border-green-300">
                {carta.status}
              </Badge>
              {carta.data_publicacao && (
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(carta.data_publicacao), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              )}
            </div>

            <CardTitle className="text-3xl font-bold text-purple-900 leading-tight mb-6">
              {carta.titulo}
            </CardTitle>

            {/* Informações do Autor */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-purple-800">
                <User className="w-4 h-4" />
                <span className="font-medium">{carta.autor_nome || "Anônimo"}</span>
              </div>
              {carta.comunidade_origem && (
                <div className="flex items-center gap-2 text-purple-700">
                  <span>•</span>
                  <span>{carta.comunidade_origem}</span>
                </div>
              )}
              {carta.territorio_origem && (
                <div className="flex items-center gap-2 text-purple-700">
                  <MapPin className="w-4 h-4" />
                  <span>{carta.territorio_origem}</span>
                </div>
              )}
            </div>

            {/* Destinatários */}
            {carta.destinatarios && carta.destinatarios.length > 0 && (
              <div className="mt-4 p-3 bg-purple-100/50 rounded-lg">
                <p className="text-xs font-semibold text-purple-900 mb-2">Destinatários:</p>
                <div className="flex flex-wrap gap-2">
                  {carta.destinatarios.map((dest, idx) => (
                    <Badge key={idx} className="bg-purple-200 text-purple-900 border-purple-300">
                      {dest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-8">
            {/* Conteúdo */}
            <div 
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: carta.conteudo }}
            />

            {/* Temas */}
            {carta.temas && carta.temas.length > 0 && (
              <div className="mt-8 pt-6 border-t border-purple-100">
                <p className="text-sm font-semibold text-purple-900 mb-3">Temas abordados:</p>
                <div className="flex flex-wrap gap-2">
                  {carta.temas.map((tema, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline"
                      className="border-pink-300 text-pink-800 bg-pink-50"
                    >
                      {tema}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Apoios */}
            {carta.apoios && carta.apoios.length > 0 && (
              <div className="mt-8 pt-6 border-t border-purple-100">
                <div className="flex items-center gap-2 text-pink-700">
                  <Heart className="w-5 h-5 fill-current" />
                  <p className="font-semibold">
                    {carta.apoios.length} {carta.apoios.length === 1 ? "pessoa apoiou" : "pessoas apoiaram"} esta carta
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800 text-center">
              Esta carta faz parte do movimento de expressão livre dos povos e comunidades tradicionais. 
              Apoie, compartilhe e amplifique essas vozes que resistem e existem.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}