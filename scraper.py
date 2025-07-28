import yt_dlp
import sys

def main():
    # Link do posta z wideo
    if len(sys.argv) < 2:
        print("❌ Error: please enter correct video link.")
        exit()

    video_url = sys.argv[1]
    # Prosta walidacja linku
    accepted_domains = ["twitter.com", "x.com", "instagram.com", "youtube.com", "youtu.be", "tiktok.com"]
    if not any(domain in video_url for domain in accepted_domains):
        print("❌ Error: Please provide a valid link.", file=sys.stderr)
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
            video_info = ydl.extract_info(video_url, download=False)
            
            print(video_info['url'])

    except yt_dlp.utils.DownloadError as e:
        print(f"❌ Error: Failed to process the link. Please check if it is correct and contains a video.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}", file=sys.stderr)
        sys.exit(1)
    

if __name__ == "__main__":
    main()