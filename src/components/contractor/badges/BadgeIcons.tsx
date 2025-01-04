import { Award, Clock, Star, Wrench, MessageCircle, RotateCcw, Trophy, BarChart3, Medal, CheckCircle, Receipt, Lock } from "lucide-react";

export const BadgeIcons = {
  expeditious: <Clock className="h-5 w-5 text-blue-500" />,
  clientFavorite: <Star className="h-5 w-5 text-yellow-500" />,
  precision: <Wrench className="h-5 w-5 text-purple-500" />,
  responsive: <MessageCircle className="h-5 w-5 text-green-500" />,
  adaptable: <RotateCcw className="h-5 w-5 text-orange-500" />,
  topContractor: <Trophy className="h-5 w-5 text-amber-500" />,
  highVolume: <BarChart3 className="h-5 w-5 text-indigo-500" />,
  preferred: <Award className="h-5 w-5 text-rose-500" />,
  compliant: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  paperwork: <Receipt className="h-5 w-5 text-cyan-500" />,
  safety: <Lock className="h-5 w-5 text-red-500" />
};