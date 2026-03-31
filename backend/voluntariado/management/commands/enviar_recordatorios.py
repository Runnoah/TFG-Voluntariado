from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from voluntariado.models import Inscripcion, Anuncio
from django.core.mail import send_mail
from django.conf import settings

class Command(BaseCommand):
    help = 'Envía recordatorios a los voluntarios 5 días antes de la actividad.'

    def handle(self, *args, **kwargs):
        hoy = timezone.now()
        # Calculamos la ventana de 24 horas a partir de 5 días desde hoy
        fecha_objetivo_inicio = hoy + timedelta(days=5)
        fecha_objetivo_fin = fecha_objetivo_inicio + timedelta(days=1)
        
        # Filtramos anuncios que estén publicados y que sucedan dentro de 5 días
        anuncios = Anuncio.objects.filter(
            estado='publicado',
            fecha_evento__gte=fecha_objetivo_inicio,
            fecha_evento__lt=fecha_objetivo_fin
        )

        if not anuncios.exists():
            self.stdout.write(self.style.SUCCESS("No hay actividades programadas para dentro de 5 días."))
            return

        inscripciones = Inscripcion.objects.filter(anuncio__in=anuncios)
        
        enviados = 0
        for inscripcion in inscripciones:
            user = inscripcion.usuario
            anuncio = inscripcion.anuncio
            
            if user.email:
                asunto = f"Recordatorio: {anuncio.titulo} es en 5 días"
                lugar = anuncio.pedanias.nombre if anuncio.pedanias else 'Lugar por determinar'
                fecha_formateada = anuncio.fecha_evento.strftime('%d/%m/%Y a las %H:%M')
                
                mensaje = (
                    f"Hola {user.username},\n\n"
                    f"Te recordamos que la actividad '{anuncio.titulo}' a la que estás inscrito(a) "
                    f"se realizará el próximo {fecha_formateada}.\n\n"
                    f"Lugar: {lugar}\n\n"
                    f"¡Te esperamos con entusiasmo!"
                )
                try:
                    send_mail(
                        asunto,
                        mensaje,
                        getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@voluntariado.com'),
                        [user.email],
                        fail_silently=True
                    )
                    enviados += 1
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Error al enviar correo a {user.email}: {e}"))
        
        self.stdout.write(self.style.SUCCESS(f"Se han enviado {enviados} recordatorios exitosamente."))
