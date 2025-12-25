import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Edit, Trash2, Calendar, User, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusColors = {
  rascunho: "bg-gray-100 text-gray-800 border-gray-300",
  publicada: "bg-green-100 text-green-800 border-green-300",
  arquivada: "bg-orange-100 text-orange-800 border-orange-300"
};

export default function CartaAbertaCard({ carta, index, user, onView, onEdit, onDelete, onApoiar }) {
  const isAutor = user?.email === carta.autor_email;
  const jaApoiou = (carta.apoios || []).includes(user?.email);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-2xl h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <Badge className={`${statusColors[carta.status]} border`}>
              {carta.status}
            </Badge>
            {carta.data_publicacao && (
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <Calendar className="w-3 h-3" />
                {format(new Date(carta.data_publicacao), "d MMM", { locale: ptBR })}
              </div>
            )}
          </div>

          <CardTitle className="text-lg font-bold text-purple-900 leading-tight">
            {carta.titulo}
          </CardTitle>

          <div className="flex flex-col gap-1 text-xs text-amber-700 mt-2">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{carta.autor_nome || "Anônimo"}</span>
            </div>
            {carta.comunidade_origem && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{carta.comunidade_origem}</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {/* Preview do conteúdo */}
          <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-4">
            {carta.conteudo}
          </p>

          {/* Temas */}
          {carta.temas && carta.temas.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {carta.temas.slice(0, 3).map((tema, idx) => (
                <Badge 
                  key={idx} 
                  variant="outline" 
                  className="text-xs border-amber-300 text-amber-800"
                >
                  {tema}
                </Badge>
              ))}
              {carta.temas.length > 3 && (
                <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                  +{carta.temas.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Ações */}
          <div className="mt-auto pt-4 border-t border-purple-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {!isAutor && carta.status === "publicada" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onApoiar}
                    disabled={jaApoiou}
                    className={`${
                      jaApoiou 
                        ? "text-pink-600" 
                        : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${jaApoiou ? "fill-current" : ""}`} />
                    {carta.apoios?.length || 0}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onView}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <Eye className="w-4 h-4" />
                </Button>

                {isAutor && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onEdit}
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onDelete}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}