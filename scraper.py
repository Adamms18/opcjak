import yt_dlp
import sys

def main():
    # Link do tweeta z wideo
    if len(sys.argv) < 2:
        print("❌ Błąd: Proszę podać link do tweeta jako argument wywołania skryptu.")
        exit()

    tweet_url = sys.argv[1]
    # Prosta walidacja linku
    if not ("twitter.com" in tweet_url or "x.com" in tweet_url):
        print("❌ Błąd: Proszę podać poprawny link do tweeta (x.com lub twitter.com).", file=sys.stderr)
        sys.exit(1)

    # Opcje dla yt-dlp
    # Chcemy tylko uzyskać informacje, bez pobierania pliku
    ydl_opts = {
        'quiet': True,       # Nie drukuj niepotrzebnych informacji w konsoli
        'get_url': True,     # Zamiast pobierać, zdobądź bezpośredni URL
        'format': 'best'     # Wybierz najlepszą dostępną jakość
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Wyodrębnij informacje z linku
            video_info = ydl.extract_info(tweet_url, download=False)
            
            print(video_info['url'])

    except yt_dlp.utils.DownloadError as e:
        print(f"❌ Błąd: Nie udało się przetworzyć linku. Sprawdź, czy jest poprawny i zawiera wideo.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"❌ Wystąpił nieoczekiwany błąd: {e}", file=sys.stderr)
        sys.exit(1)
    

if __name__ == "__main__":
    main()