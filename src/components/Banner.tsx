const Banner = () => {
    return (
        <div className="relative z-0 mb-12">
            <img
                src="./img/HeroImage.png"
                alt=""
                className="w-full h-64 object-cover"
            />
            <div className="bg-black opacity-50 absolute top-0 left-0 w-full h-full"></div>
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold text-white text-center">Lassen Sie sich inspirieren, kochen Sie mit Leidenschaft und erleben Sie unvergessliche Momente bei Tisch.</p>
        </div>
    );
}

export default Banner;