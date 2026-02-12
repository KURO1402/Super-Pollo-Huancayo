const MapaSuperPollo = ({ direccion, width = "100%", height = "400px" }) => {
    
  const embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.6133506171236!2d-75.2071273!3d-12.070102499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x910e964e0aed5f15%3A0x6de61b9e46992130!2sSuperpollo!5e0!3m2!1ses!2spe!4v1770914112866!5m2!1ses!2spe";
  
  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      <iframe
        src={embedUrl}
        width={width}
        height={height}
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Mapa - ${direccion}`}
        className="w-full"
      />
    </div>
  );
};

export default MapaSuperPollo;