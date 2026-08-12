# Działkomierz

**Darmowa aplikacja na Androida do rozpoznawania działek i pomiaru powierzchni pól.**
Zrobiona przez rolnika, dla rolników.

Odpowiada na trzy pytania: **gdzie jestem · czyja to działka · ile to hektarów**

Korzysta wyłącznie z publicznych rejestrów Głównego Urzędu Geodezji i Kartografii.
Bez konta, bez logowania, bez reklam, bez śledzenia.

---

## Pobieranie

**Jeden link, zawsze najnowsza wersja:**

### 📥 [Pobierz Działkomierz](https://github.com/dominikmaslak11/dzialkomierz/releases/latest/download/Dzialkomierz.apk)

1. Otwórz ten link na telefonie (Android 8 lub nowszy) i pobierz plik.
2. Otwórz pobrany plik — z paska powiadomień albo z menedżera plików.
3. Android poprosi o zgodę na instalację z tego źródła — aplikacja nie pochodzi ze Sklepu Play,
   więc to normalne. Zgadzasz się raz.

Konto na GitHubie **nie jest potrzebne** — plik pobiera się bez logowania.

Wszystkie wydania i opisy zmian: zakładka **[Releases](../../releases)**.

Aplikacja sama sprawdza, czy jest nowsza wersja, i pomoże ją zainstalować.

---

## Co potrafi

**Rozpoznaje działkę, na której stoisz.** Odczytuje GPS (medianę z kilku pomiarów) i pyta rejestr
ULDK o gminę, obręb, numer i powierzchnię ewidencyjną.

**Pokazuje granicę działki na zdjęciu lotniczym.** Zdjęcia i granice pochodzą z tego samego urzędu
i z tego samego układu współrzędnych, więc granica ląduje dokładnie na miedzach i ogrodzeniach
widocznych na zdjęciu. Od razu widać, czy odczyt trafił dobrze.

**Mówi, kiedy nie jest pewna.** Jeśli stoisz bliżej granicy niż wynosi błąd GPS, ostrzega
i wypisuje sąsiednie działki, zamiast podawać jeden numer tak, jakby nie było wątpliwości.

**Mierzy pole na dwa sposoby.** Objedź granicę ciągnikiem albo **obrysuj pole palcem po zdjęciu
satelitarnym, nie wychodząc z podwórka** — ta druga metoda bywa dokładniejsza, bo nie ma w niej
błędu wynikającego z tego, że telefon jedzie metr czy dwa od rzeczywistej granicy.

**Odejmuje przeszkody.** Zadrzewienie, oczko wodne, słup — objedź je albo obrysuj, a powierzchnia
zostanie odjęta. Dzięki temu wynik to powierzchnia, którą się faktycznie fakturuje.

**Sumuje kilka działek** jako jedno pole, bo tak wygląda prawdziwa robota.

**Zapisuje pomiary** i pozwala **wysłać wynik jako obrazek** — zdjęcie lotnicze z obrysem
i powierzchnią, które klient obejrzy w trzy sekundy.

**Własne nazwy pól.** Nazwa przypisuje się do działki, więc przy następnym postoju w tym samym
miejscu aplikacja wita nazwą „Pole za oborą", a nie numerem ewidencyjnym.

---

## Jakiej dokładności się spodziewać

Przy pomiarze powierzchni dominującym błędem **nie jest szum GPS**, tylko odległość telefonu
od rzeczywistej granicy pola — bo ten błąd skaluje się z obwodem. Na polu 5 ha każdy metr
odsunięcia to około 1,8% powierzchni.

| sposób pomiaru | realny błąd |
|---|---|
| obrysowanie po zdjęciu | poniżej 1% |
| objazd z wpisaną korektą odległości | ~1% |
| objazd bez korekty | 2–4% |
| obejście pieszo po granicy | 0,5–1% |
| linia drzew, telefon w kabinie pod blachą | 5–10% |

Do dokładności centymetrowej potrzebny jest zewnętrzny odbiornik RTK. Żaden telefon tego nie da
i aplikacja tego nie obiecuje.

---

## Prywatność

Aplikacja wysyła współrzędne do publicznych usług GUGiK (rejestr działek ULDK, rejestr adresowy
PRG, serwis ortofotomapy) **wyłącznie po to**, żeby zapytać o działkę, adres albo zdjęcie danego
miejsca.

Nie zbiera, nie przechowuje i nie przesyła danych nigdzie indziej. Nie ma konta, reklam ani
narzędzi analitycznych. Zapisane pomiary leżą wyłącznie w pamięci telefonu.

Aplikacja **nie pokazuje danych o właścicielach działek i nie ma do nich dostępu** — to dane
osobowe, których publiczne rejestry nie udostępniają.

---

## Źródła danych

Dane o działkach, adresach i zdjęcia lotnicze pochodzą z rejestrów **Głównego Urzędu Geodezji
i Kartografii** (ULDK, PRG, ortofotomapa).

---

## Błędy i sugestie

Aplikacja jest w rozwoju i chętnie przyjmę uwagi.

- **E-mail:** dominikmaslak11@gmail.com
- **WhatsApp:** +48 668 793 957

---

## Uwaga o kodzie źródłowym

To repozytorium zawiera wydania aplikacji, nie jej kod źródłowy.
