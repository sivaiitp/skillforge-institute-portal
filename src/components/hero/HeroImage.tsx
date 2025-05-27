
const HeroImage = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20"></div>
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="h-4 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full"></div>
            <div className="h-4 bg-gradient-to-r from-green-300 to-blue-300 rounded-full w-3/4"></div>
            <div className="h-4 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full w-1/2"></div>
          </div>
          <div className="space-y-4">
            <div className="h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            </div>
            <div className="h-4 bg-gradient-to-r from-orange-300 to-red-300 rounded-full w-2/3"></div>
          </div>
        </div>
        <div className="mt-6 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
          <div className="text-2xl font-bold text-gray-400">📊</div>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;
