import { Award, TrendingUp, Users, Zap, Star, Target, Sparkles, Crown } from "lucide-react";

interface BadgeType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  requirement?: string;
}

export function BadgesWidget() {
  const badges: BadgeType[] = [
    {
      id: "most-searched",
      name: "Most Searched",
      description: "One of the top 10 most searched faculty this month",
      icon: TrendingUp,
      color: "text-[#8b0000]",
      bgColor: "bg-gradient-to-br from-[#8b0000] to-[#6b0000]",
      borderColor: "border-[#8b0000]",
      earned: true,
      earnedDate: "January 2026",
    },
    {
      id: "rising-star",
      name: "Rising Star",
      description: "300% increase in profile views over the last 3 months",
      icon: Star,
      color: "text-[#ffd100]",
      bgColor: "bg-gradient-to-br from-[#ffd100] to-[#e6bc00]",
      borderColor: "border-[#ffd100]",
      earned: true,
      earnedDate: "December 2025",
    },
    {
      id: "cross-disciplinary",
      name: "Cross-Disciplinary Collaborator",
      description: "Collaborate with faculty from 5+ different departments",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-600 to-blue-500",
      borderColor: "border-blue-600",
      earned: true,
      earnedDate: "November 2025",
    },
    {
      id: "citation-champion",
      name: "Citation Champion",
      description: "Reach 1000+ total citations",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-600 to-purple-500",
      borderColor: "border-purple-600",
      earned: true,
      earnedDate: "October 2025",
    },
    {
      id: "profile-complete",
      name: "Profile Master",
      description: "Complete 100% of your profile",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-600 to-green-500",
      borderColor: "border-green-600",
      earned: false,
      progress: 85,
      requirement: "Complete 15% more",
    },
    {
      id: "industry-connector",
      name: "Industry Connector",
      description: "Receive 50+ contact requests from external organizations",
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-600 to-orange-500",
      borderColor: "border-orange-600",
      earned: false,
      progress: 72,
      requirement: "14 more requests needed",
    },
    {
      id: "innovation-leader",
      name: "Innovation Leader",
      description: "File 5+ patents or publish 20+ papers",
      icon: Sparkles,
      color: "text-pink-600",
      bgColor: "bg-gradient-to-br from-pink-600 to-pink-500",
      borderColor: "border-pink-600",
      earned: false,
      progress: 60,
      requirement: "8 more papers needed",
    },
    {
      id: "top-performer",
      name: "Top Performer",
      description: "Be in the top 5% of faculty by overall engagement",
      icon: Crown,
      color: "text-yellow-600",
      bgColor: "bg-gradient-to-br from-yellow-600 to-yellow-500",
      borderColor: "border-yellow-600",
      earned: false,
      progress: 45,
      requirement: "Keep improving!",
    },
  ];

  const earnedBadges = badges.filter(badge => badge.earned);
  const inProgressBadges = badges.filter(badge => !badge.earned);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900">Achievement Badges</h2>
          <p className="text-gray-600 mt-1">
            {earnedBadges.length} of {badges.length} badges earned
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-light text-[#8b0000]">{earnedBadges.length}</div>
          <div className="text-sm text-gray-600">Badges</div>
        </div>
      </div>

      {/* Earned Badges */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#8b0000]" />
          Earned Badges ({earnedBadges.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {earnedBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`relative bg-white rounded-lg border-2 ${badge.borderColor} p-5 shadow-sm hover:shadow-md transition-all`}
              >
                {/* Earned Ribbon */}
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium">
                  ✓ Earned
                </div>

                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 ${badge.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{badge.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                    <p className="text-xs text-gray-500">Earned: {badge.earnedDate}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* In Progress Badges */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-gray-600" />
          In Progress ({inProgressBadges.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inProgressBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className="relative bg-white rounded-lg border-2 border-gray-200 p-5 opacity-75 hover:opacity-100 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-8 h-8 ${badge.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{badge.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                    
                    {/* Progress Bar */}
                    {badge.progress !== undefined && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">{badge.requirement}</span>
                          <span className={badge.color}>{badge.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${badge.bgColor} transition-all duration-500 rounded-full`}
                            style={{ width: `${badge.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge Summary */}
      <div className="bg-gradient-to-r from-[#8b0000] to-[#6b0000] rounded-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#ffd100] rounded-lg flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-[#8b0000]" />
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2">Keep Up the Great Work!</h3>
            <p className="text-sm text-white/90 mb-3">
              You've earned {earnedBadges.length} badges so far. Complete your profile and continue engaging with 
              the SCOUP community to unlock more achievements!
            </p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>{earnedBadges.length} Earned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>{inProgressBadges.length} In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
