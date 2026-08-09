const API_URL = 'https://api.nasa.gov/planetary/apod';
const TRANSLATION_API_URL = 'https://api.mymemory.translated.net/get';
const DEFAULT_API_KEY = 'DEMO_KEY';
const DAYS_TO_SHOW = 9;
const EARLIEST_END_DATE = '1995-06-24';

const LOCALES = {
  en: {
    nativeName: 'English',
    pageTitle: 'NASA APOD Explorer',
    description:
      'NASA-inspired APOD gallery that shows nine consecutive days of astronomy images and videos.',
    eyebrow: 'NASA Astronomy Picture of the Day',
    heroTitle: 'Nine Days of Deep Space Discovery',
    heroText:
      'Choose an ending date and explore a consecutive 9-day APOD gallery with image, video, and modal details.',
    languageLabel: 'Language',
    endDateLabel: 'End date',
    endDateHint: 'Select the last day in the 9-day range.',
    loadGallery: 'Load gallery',
    factKicker: 'Did You Know?',
    factTitle: 'Random space fact',
    factLoading: 'Loading a cosmic fact...',
    galleryKicker: 'Gallery',
    galleryTitle: 'APOD results',
    statusIdle: 'Select a date to begin.',
    loading: 'Loading NASA imagery for 9 consecutive days...',
    modalKicker: 'APOD detail',
    modalCloseLabel: 'Close dialog',
    openOriginalMedia: 'Open original media',
    openOriginalVideo: 'Open original video',
    selectLaterEndDate:
      'Choose a later end date so the 9-day range stays within APOD history.',
    loadError: 'Unable to load APOD data right now. Please try again.',
    unexpectedError: 'Unexpected error.',
    videoLabel: 'Video',
    videoFallback: 'Open the original media to watch this APOD entry.',
    rangeWillShow: (formattedDate) => `Gallery will show 9 consecutive days ending on ${formattedDate}.`,
    loadedEntries: (count, formattedDate) => `Loaded ${count} entries ending on ${formattedDate}.`,
    showingRange: (startDate, endDate) =>
      `Showing 9 APOD entries from ${startDate} through ${endDate}.`,
    openDetailsFor: (title) => `Open details for ${title}`,
    facts: [
      'A day on Venus is longer than its year because the planet spins so slowly.',
      'Apollo missions left mirrors on the Moon that scientists still use today.',
      'Neutron stars can spin hundreds of times per second.',
      'The observable universe may contain more galaxies than grains of sand on Earth.',
      'Mars has the tallest volcano in the solar system: Olympus Mons.'
    ]
  },
  es: {
    nativeName: 'Español',
    pageTitle: 'Explorador APOD de NASA',
    description:
      'Galería APOD inspirada en NASA que muestra nueve días consecutivos de imágenes y videos astronómicos.',
    eyebrow: 'Imagen astronómica del día de NASA',
    heroTitle: 'Nueve días de exploración del espacio profundo',
    heroText:
      'Elige una fecha final y explora una galería APOD consecutiva de 9 días con imagen, video y detalles en modal.',
    languageLabel: 'Idioma',
    endDateLabel: 'Fecha final',
    endDateHint: 'Selecciona el último día del rango de 9 días.',
    loadGallery: 'Cargar galería',
    factKicker: '¿Sabías que?',
    factTitle: 'Dato espacial aleatorio',
    factLoading: 'Cargando un dato cósmico...',
    galleryKicker: 'Galería',
    galleryTitle: 'Resultados APOD',
    statusIdle: 'Selecciona una fecha para comenzar.',
    loading: 'Cargando imágenes de NASA para 9 días consecutivos...',
    modalKicker: 'Detalle APOD',
    modalCloseLabel: 'Cerrar diálogo',
    openOriginalMedia: 'Abrir medio original',
    openOriginalVideo: 'Abrir video original',
    selectLaterEndDate:
      'Elige una fecha final posterior para que el rango de 9 días permanezca dentro del historial APOD.',
    loadError: 'No se puede cargar APOD en este momento. Inténtalo de nuevo.',
    unexpectedError: 'Error inesperado.',
    videoLabel: 'Video',
    videoFallback: 'Abre el medio original para ver esta entrada APOD.',
    rangeWillShow: (formattedDate) => `La galería mostrará 9 días consecutivos hasta el ${formattedDate}.`,
    loadedEntries: (count, formattedDate) => `Se cargaron ${count} entradas hasta el ${formattedDate}.`,
    showingRange: (startDate, endDate) =>
      `Mostrando 9 entradas APOD desde ${startDate} hasta ${endDate}.`,
    openDetailsFor: (title) => `Abrir detalles de ${title}`,
    facts: [
      'Un día en Venus dura más que su año porque gira muy lentamente.',
      'Las misiones Apolo dejaron espejos en la Luna que aún se usan.',
      'Las estrellas de neutrones pueden girar cientos de veces por segundo.',
      'El universo observable puede tener más galaxias que granos de arena en la Tierra.',
      'Marte tiene el volcán más alto del sistema solar: Olympus Mons.'
    ]
  },
  de: {
    nativeName: 'Deutsch',
    pageTitle: 'NASA APOD Explorer',
    description:
      'Von NASA inspiriertes APOD-Galerieerlebnis mit neun aufeinanderfolgenden Tagen astronomischer Bilder und Videos.',
    eyebrow: 'NASA-Astronomiebild des Tages',
    heroTitle: 'Neun Tage tiefer Weltraumentdeckung',
    heroText:
      'Wähle ein Enddatum und erkunde eine zusammenhängende 9-Tage-APOD-Galerie mit Bild-, Video- und Modal-Details.',
    languageLabel: 'Sprache',
    endDateLabel: 'Enddatum',
    endDateHint: 'Wähle den letzten Tag im 9-Tage-Bereich.',
    loadGallery: 'Galerie laden',
    factKicker: 'Schon gewusst?',
    factTitle: 'Zufälliger Weltraumfakt',
    factLoading: 'Ein kosmischer Fakt wird geladen...',
    galleryKicker: 'Galerie',
    galleryTitle: 'APOD-Ergebnisse',
    statusIdle: 'Wähle ein Datum, um zu beginnen.',
    loading: 'NASA-Bilder für 9 aufeinanderfolgende Tage werden geladen...',
    modalKicker: 'APOD-Details',
    modalCloseLabel: 'Dialog schließen',
    openOriginalMedia: 'Originalmedium öffnen',
    openOriginalVideo: 'Originalvideo öffnen',
    selectLaterEndDate:
      'Wähle ein späteres Enddatum, damit der 9-Tage-Bereich innerhalb der APOD-Historie bleibt.',
    loadError: 'APOD-Daten können gerade nicht geladen werden. Bitte versuche es erneut.',
    unexpectedError: 'Unerwarteter Fehler.',
    videoLabel: 'Video',
    videoFallback: 'Öffne das Originalmedium, um diesen APOD-Eintrag anzusehen.',
    rangeWillShow: (formattedDate) => `Die Galerie zeigt 9 aufeinanderfolgende Tage bis ${formattedDate}.`,
    loadedEntries: (count, formattedDate) => `${count} Einträge bis ${formattedDate} geladen.`,
    showingRange: (startDate, endDate) =>
      `Es werden 9 APOD-Einträge von ${startDate} bis ${endDate} angezeigt.`,
    openDetailsFor: (title) => `Details für ${title} öffnen`,
    facts: [
      'Ein Tag auf der Venus dauert länger als ihr Jahr.',
      'Apollo-Missionen hinterließen Spiegel auf dem Mond, die noch heute genutzt werden.',
      'Neutronensterne können sich hunderte Male pro Sekunde drehen.',
      'Das beobachtbare Universum könnte mehr Galaxien haben als Sandkörner auf der Erde.',
      'Der Mars besitzt den höchsten Vulkan des Sonnensystems: Olympus Mons.'
    ]
  },
  fr: {
    nativeName: 'Français',
    pageTitle: 'Explorateur APOD NASA',
    description:
      'Galerie APOD inspirée de la NASA affichant neuf jours consécutifs d’images et de vidéos astronomiques.',
    eyebrow: 'Image astronomique du jour de la NASA',
    heroTitle: 'Neuf jours de découverte du ciel profond',
    heroText:
      'Choisissez une date de fin et explorez une galerie APOD de 9 jours consécutifs avec image, vidéo et détails en modal.',
    languageLabel: 'Langue',
    endDateLabel: 'Date de fin',
    endDateHint: 'Sélectionnez le dernier jour de la période de 9 jours.',
    loadGallery: 'Charger la galerie',
    factKicker: 'Le saviez-vous ?',
    factTitle: 'Fait spatial aléatoire',
    factLoading: 'Chargement d’un fait cosmique...',
    galleryKicker: 'Galerie',
    galleryTitle: 'Résultats APOD',
    statusIdle: 'Sélectionnez une date pour commencer.',
    loading: 'Chargement des images NASA pour 9 jours consécutifs...',
    modalKicker: 'Détail APOD',
    modalCloseLabel: 'Fermer la boîte de dialogue',
    openOriginalMedia: 'Ouvrir le média original',
    openOriginalVideo: 'Ouvrir la vidéo originale',
    selectLaterEndDate:
      'Choisissez une date de fin plus tardive afin que la période de 9 jours reste dans l’historique APOD.',
    loadError: 'Impossible de charger les données APOD pour le moment. Réessayez.',
    unexpectedError: 'Erreur inattendue.',
    videoLabel: 'Vidéo',
    videoFallback: 'Ouvrez le média original pour voir cette entrée APOD.',
    rangeWillShow: (formattedDate) => `La galerie affichera 9 jours consécutifs jusqu’au ${formattedDate}.`,
    loadedEntries: (count, formattedDate) => `${count} entrées chargées jusqu’au ${formattedDate}.`,
    showingRange: (startDate, endDate) =>
      `Affichage de 9 entrées APOD du ${startDate} au ${endDate}.`,
    openDetailsFor: (title) => `Ouvrir les détails de ${title}`,
    facts: [
      'Une journée sur Vénus est plus longue que son année.',
      'Les missions Apollo ont laissé des miroirs sur la Lune encore utilisés aujourd’hui.',
      'Les étoiles à neutrons peuvent tourner des centaines de fois par seconde.',
      'L’univers observable pourrait contenir plus de galaxies que de grains de sable sur Terre.',
      'Mars possède le plus grand volcan du système solaire : Olympus Mons.'
    ]
  },
  ja: {
    nativeName: '日本語',
    pageTitle: 'NASA APOD エクスプローラー',
    description:
      'NASA風のAPODギャラリーで、9日連続の天文画像と動画を表示します。',
    eyebrow: 'NASA 今日の天文画像',
    heroTitle: '深宇宙を巡る9日間',
    heroText:
      '終了日を選ぶと、画像・動画・モーダル詳細を含む9日連続のAPODギャラリーを楽しめます。',
    languageLabel: '言語',
    endDateLabel: '終了日',
    endDateHint: '9日間の最終日を選択してください。',
    loadGallery: 'ギャラリーを読み込む',
    factKicker: '知っていましたか？',
    factTitle: 'ランダムな宇宙の豆知識',
    factLoading: '宇宙の豆知識を読み込み中...',
    galleryKicker: 'ギャラリー',
    galleryTitle: 'APOD結果',
    statusIdle: '日付を選択して開始してください。',
    loading: 'NASAの画像を9日連続で読み込み中...',
    modalKicker: 'APOD詳細',
    modalCloseLabel: 'ダイアログを閉じる',
    openOriginalMedia: '元のメディアを開く',
    openOriginalVideo: '元の動画を開く',
    selectLaterEndDate:
      '9日間の範囲がAPODの履歴に収まるよう、より新しい終了日を選んでください。',
    loadError: '現在APODデータを読み込めません。もう一度お試しください。',
    unexpectedError: '予期しないエラーです。',
    videoLabel: '動画',
    videoFallback: 'このAPOD項目を見るには元のメディアを開いてください。',
    rangeWillShow: (formattedDate) => `ギャラリーは ${formattedDate} までの9日間を表示します。`,
    loadedEntries: (count, formattedDate) => `${count}件を ${formattedDate} まで読み込みました。`,
    showingRange: (startDate, endDate) =>
      `9件のAPODを ${startDate} から ${endDate} まで表示しています。`,
    openDetailsFor: (title) => `${title} の詳細を開く`,
    facts: [
      '金星の1日は、金星の1年より長いです。',
      'アポロ計画の鏡は、今でも月面距離の測定に使われています。',
      '中性子星は1秒間に何百回も回転することがあります。',
      '観測可能な宇宙には、地球上の砂粒より多くの銀河があるかもしれません。',
      '火星には太陽系最大の火山、オリンポス山があります。'
    ]
  },
  ko: {
    nativeName: '한국어',
    pageTitle: 'NASA APOD 탐험기',
    description:
      'NASA에서 영감을 받은 APOD 갤러리로, 9일 연속의 천문 이미지와 비디오를 보여줍니다.',
    eyebrow: 'NASA 오늘의 천문 사진',
    heroTitle: '깊은 우주를 향한 9일간의 탐험',
    heroText:
      '종료 날짜를 선택하면 이미지, 비디오, 모달 상세 정보를 포함한 9일 연속 APOD 갤러리를 볼 수 있습니다.',
    languageLabel: '언어',
    endDateLabel: '종료 날짜',
    endDateHint: '9일 범위의 마지막 날짜를 선택하세요.',
    loadGallery: '갤러리 불러오기',
    factKicker: '알고 계셨나요?',
    factTitle: '무작위 우주 상식',
    factLoading: '우주 상식을 불러오는 중...',
    galleryKicker: '갤러리',
    galleryTitle: 'APOD 결과',
    statusIdle: '시작하려면 날짜를 선택하세요.',
    loading: 'NASA 이미지를 9일 연속으로 불러오는 중...',
    modalKicker: 'APOD 상세',
    modalCloseLabel: '대화상자 닫기',
    openOriginalMedia: '원본 미디어 열기',
    openOriginalVideo: '원본 비디오 열기',
    selectLaterEndDate:
      '9일 범위가 APOD 기록 안에 들어가도록 더 늦은 종료 날짜를 선택하세요.',
    loadError: '현재 APOD 데이터를 불러올 수 없습니다. 다시 시도해 주세요.',
    unexpectedError: '예기치 않은 오류입니다.',
    videoLabel: '비디오',
    videoFallback: '이 APOD 항목을 보려면 원본 미디어를 여세요.',
    rangeWillShow: (formattedDate) => `갤러리는 ${formattedDate}까지의 9일을 표시합니다.`,
    loadedEntries: (count, formattedDate) => `${formattedDate}까지 ${count}개 항목을 불러왔습니다.`,
    showingRange: (startDate, endDate) => `9개의 APOD를 ${startDate}부터 ${endDate}까지 표시합니다.`,
    openDetailsFor: (title) => `${title} 세부정보 열기`,
    facts: [
      '금성의 하루는 금성의 1년보다 더 깁니다.',
      '아폴로 임무는 오늘날에도 쓰이는 달 반사경을 남겼습니다.',
      '중성자별은 초당 수백 회 회전할 수 있습니다.',
      '관측 가능한 우주에는 지구의 모래 알갱이보다 많은 은하가 있을 수 있습니다.',
      '화성에는 태양계에서 가장 높은 화산인 올림푸스 산이 있습니다.'
    ]
  },
  'zh-Hans': {
    nativeName: '中文',
    pageTitle: 'NASA APOD 探索器',
    description:
      '受 NASA 启发的 APOD 画廊，展示连续 9 天的天文图片和视频。',
    eyebrow: 'NASA 每日天文图片',
    heroTitle: '穿越深空的九天',
    heroText:
      '选择结束日期，浏览包含图片、视频和弹窗详情的连续 9 天 APOD 画廊。',
    languageLabel: '语言',
    endDateLabel: '结束日期',
    endDateHint: '请选择 9 天范围中的最后一天。',
    loadGallery: '加载画廊',
    factKicker: '你知道吗？',
    factTitle: '随机太空知识',
    factLoading: '正在加载宇宙知识...',
    galleryKicker: '画廊',
    galleryTitle: 'APOD 结果',
    statusIdle: '请选择日期开始。',
    loading: '正在加载连续 9 天的 NASA 图像...',
    modalKicker: 'APOD 详情',
    modalCloseLabel: '关闭对话框',
    openOriginalMedia: '打开原始媒体',
    openOriginalVideo: '打开原始视频',
    selectLaterEndDate:
      '请选择更晚的结束日期，使 9 天范围仍在 APOD 历史范围内。',
    loadError: '当前无法加载 APOD 数据。请重试。',
    unexpectedError: '发生了意外错误。',
    videoLabel: '视频',
    videoFallback: '打开原始媒体以观看此 APOD 条目。',
    rangeWillShow: (formattedDate) => `画廊将显示截至 ${formattedDate} 的连续 9 天。`,
    loadedEntries: (count, formattedDate) => `已加载截至 ${formattedDate} 的 ${count} 条记录。`,
    showingRange: (startDate, endDate) => `正在显示从 ${startDate} 到 ${endDate} 的 9 条 APOD 记录。`,
    openDetailsFor: (title) => `打开 ${title} 的详情`,
    facts: [
      '金星的一天比它的一年还长。',
      '阿波罗任务在月球上留下了至今仍在使用的反射镜。',
      '中子星每秒可以旋转数百次。',
      '可观测宇宙中的星系数量可能比地球上的沙粒还多。',
      '火星拥有太阳系中最高的火山：奥林匹斯山。'
    ]
  },
  ru: {
    nativeName: 'Русский',
    pageTitle: 'NASA APOD Исследователь',
    description:
      'Галерея APOD в стиле NASA, показывающая девять последовательных дней астрономических изображений и видео.',
    eyebrow: 'Астрономическая фотография дня NASA',
    heroTitle: 'Девять дней глубокого космоса',
    heroText:
      'Выберите дату окончания и откройте галерею APOD из 9 последовательных дней с изображениями, видео и деталями в модальном окне.',
    languageLabel: 'Язык',
    endDateLabel: 'Дата окончания',
    endDateHint: 'Выберите последний день 9-дневного диапазона.',
    loadGallery: 'Загрузить галерею',
    factKicker: 'Знаете ли вы?',
    factTitle: 'Случайный факт о космосе',
    factLoading: 'Загружается космический факт...',
    galleryKicker: 'Галерея',
    galleryTitle: 'Результаты APOD',
    statusIdle: 'Выберите дату, чтобы начать.',
    loading: 'Загрузка изображений NASA за 9 последовательных дней...',
    modalKicker: 'Детали APOD',
    modalCloseLabel: 'Закрыть диалог',
    openOriginalMedia: 'Открыть оригинальный материал',
    openOriginalVideo: 'Открыть оригинальное видео',
    selectLaterEndDate:
      'Выберите более позднюю дату окончания, чтобы 9-дневный диапазон оставался в истории APOD.',
    loadError: 'Сейчас не удаётся загрузить данные APOD. Попробуйте ещё раз.',
    unexpectedError: 'Непредвиденная ошибка.',
    videoLabel: 'Видео',
    videoFallback: 'Откройте оригинальный материал, чтобы посмотреть этот APOD.',
    rangeWillShow: (formattedDate) => `Галерея покажет 9 последовательных дней до ${formattedDate}.`,
    loadedEntries: (count, formattedDate) => `Загружено ${count} записей до ${formattedDate}.`,
    showingRange: (startDate, endDate) =>
      `Показаны 9 записей APOD с ${startDate} по ${endDate}.`,
    openDetailsFor: (title) => `Открыть детали ${title}`,
    facts: [
      'Сутки на Венере длиннее её года.',
      'Миссии Apollo оставили на Луне зеркала, которые используют до сих пор.',
      'Нейтронные звёзды могут вращаться сотни раз в секунду.',
      'В наблюдаемой Вселенной может быть больше галактик, чем песчинок на Земле.',
      'На Марсе находится самый высокий вулкан Солнечной системы — Олимп Монс.'
    ]
  },
  uk: {
    nativeName: 'Українська',
    pageTitle: 'NASA APOD Дослідник',
    description:
      'Галерея APOD у стилі NASA з дев’ятьма послідовними днями астрономічних зображень і відео.',
    eyebrow: 'Астрономічне зображення дня NASA',
    heroTitle: 'Дев’ять днів глибокого космосу',
    heroText:
      'Оберіть дату завершення й відкрийте галерею APOD із 9 послідовних днів зображень, відео та деталей у модальному вікні.',
    languageLabel: 'Мова',
    endDateLabel: 'Дата завершення',
    endDateHint: 'Оберіть останній день 9-денного діапазону.',
    loadGallery: 'Завантажити галерею',
    factKicker: 'А чи знаєте ви?',
    factTitle: 'Випадковий факт про космос',
    factLoading: 'Завантажується космічний факт...',
    galleryKicker: 'Галерея',
    galleryTitle: 'Результати APOD',
    statusIdle: 'Оберіть дату, щоб почати.',
    loading: 'Завантаження зображень NASA за 9 послідовних днів...',
    modalKicker: 'Деталі APOD',
    modalCloseLabel: 'Закрити діалог',
    openOriginalMedia: 'Відкрити оригінальний матеріал',
    openOriginalVideo: 'Відкрити оригінальне відео',
    selectLaterEndDate:
      'Оберіть пізнішу дату завершення, щоб 9-денний діапазон залишався в історії APOD.',
    loadError: 'Наразі не вдається завантажити дані APOD. Спробуйте ще раз.',
    unexpectedError: 'Неочікувана помилка.',
    videoLabel: 'Відео',
    videoFallback: 'Відкрийте оригінальний матеріал, щоб переглянути цей APOD.',
    rangeWillShow: (formattedDate) => `Галерея покаже 9 послідовних днів до ${formattedDate}.`,
    loadedEntries: (count, formattedDate) => `Завантажено ${count} записів до ${formattedDate}.`,
    showingRange: (startDate, endDate) =>
      `Показано 9 записів APOD із ${startDate} по ${endDate}.`,
    openDetailsFor: (title) => `Відкрити деталі ${title}`,
    facts: [
      'Доба на Венері довша за її рік.',
      'Місії Apollo залишили на Місяці дзеркала, які використовують і досі.',
      'Нейтронні зорі можуть обертатися сотні разів на секунду.',
      'У спостережуваному Всесвіті може бути більше галактик, ніж піщинок на Землі.',
      'На Марсі є найвищий вулкан Сонячної системи — Олімп Монс.'
    ]
  },
  pl: {
    nativeName: 'Polski',
    pageTitle: 'NASA APOD Explorer',
    description:
      'Galeria APOD inspirowana NASA, pokazująca dziewięć kolejnych dni astronomicznych obrazów i wideo.',
    eyebrow: 'Astronomiczne zdjęcie dnia NASA',
    heroTitle: 'Dziewięć dni głębokiej kosmicznej odkrywczości',
    heroText:
      'Wybierz datę końcową i przeglądaj galerię APOD obejmującą 9 kolejnych dni z obrazami, wideo i szczegółami w oknie modalnym.',
    languageLabel: 'Język',
    endDateLabel: 'Data końcowa',
    endDateHint: 'Wybierz ostatni dzień 9-dniowego zakresu.',
    loadGallery: 'Wczytaj galerię',
    factKicker: 'Czy wiesz, że?',
    factTitle: 'Losowy fakt o kosmosie',
    factLoading: 'Wczytywanie kosmicznego faktu...',
    galleryKicker: 'Galeria',
    galleryTitle: 'Wyniki APOD',
    statusIdle: 'Wybierz datę, aby rozpocząć.',
    loading: 'Wczytywanie obrazów NASA z 9 kolejnych dni...',
    modalKicker: 'Szczegóły APOD',
    modalCloseLabel: 'Zamknij okno dialogowe',
    openOriginalMedia: 'Otwórz oryginalny materiał',
    openOriginalVideo: 'Otwórz oryginalne wideo',
    selectLaterEndDate:
      'Wybierz późniejszą datę końcową, aby 9-dniowy zakres mieścił się w historii APOD.',
    loadError: 'Nie można teraz wczytać danych APOD. Spróbuj ponownie.',
    unexpectedError: 'Nieoczekiwany błąd.',
    videoLabel: 'Wideo',
    videoFallback: 'Otwórz oryginalny materiał, aby obejrzeć ten wpis APOD.',
    rangeWillShow: (formattedDate) => `Galeria pokaże 9 kolejnych dni do ${formattedDate}.`,
    loadedEntries: (count, formattedDate) => `Wczytano ${count} wpisów do ${formattedDate}.`,
    showingRange: (startDate, endDate) =>
      `Pokazywanych jest 9 wpisów APOD od ${startDate} do ${endDate}.`,
    openDetailsFor: (title) => `Otwórz szczegóły ${title}`,
    facts: [
      'Doba na Wenus trwa dłużej niż jej rok.',
      'Misje Apollo zostawiły na Księżycu lustra używane do dziś.',
      'Gwiazdy neutronowe mogą obracać się setki razy na sekundę.',
      'W obserwowalnym Wszechświecie może być więcej galaktyk niż ziaren piasku na Ziemi.',
      'Na Marsie znajduje się najwyższy wulkan Układu Słonecznego: Olympus Mons.'
    ]
  }
};

const supportedLocales = Object.keys(LOCALES);
const initialLocale = getPreferredLocale();
const translationCache = new Map();
const translationTargetLocales = {
  en: 'en',
  es: 'es',
  de: 'de',
  fr: 'fr',
  ja: 'ja',
  ko: 'ko',
  'zh-Hans': 'zh-CN',
  ru: 'ru',
  uk: 'uk',
  pl: 'pl'
};

let GALAXY_DATABASE = [
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy',
    ageGyr: 10.0,
    blackHoleMassSolar: 140000000,
    stellarMassSolar: 1230000000000,
    starFormationRate: 0.4,
    morphology: 'SA(s)b spiral',
    redshift: -0.001,
    environment: 'Local Group',
    imageQuery: 'Andromeda Galaxy',
    summary: 'A massive spiral with a dense bulge and a long, quiet evolution history.'
  },
  {
    id: 'milky-way',
    name: 'Milky Way',
    ageGyr: 10.5,
    blackHoleMassSolar: 4300000,
    stellarMassSolar: 1000000000000,
    starFormationRate: 1.9,
    morphology: 'barred spiral',
    redshift: 0,
    environment: 'Local Group',
    imageQuery: 'Milky Way Galaxy',
    summary: 'Our own barred spiral galaxy with a moderately active nucleus and rich star-forming arms.'
  },
  {
    id: 'triangulum',
    name: 'Triangulum Galaxy',
    ageGyr: 8.0,
    blackHoleMassSolar: 300000,
    stellarMassSolar: 50000000000,
    starFormationRate: 0.5,
    morphology: 'spiral',
    redshift: 0.0009,
    environment: 'Local Group',
    imageQuery: 'Triangulum Galaxy',
    summary: 'A smaller spiral with bright star-forming regions and a loose, open structure.'
  },
  {
    id: 'whirlpool',
    name: 'Whirlpool Galaxy',
    ageGyr: 8.6,
    blackHoleMassSolar: 10000000,
    stellarMassSolar: 160000000000,
    starFormationRate: 3.4,
    morphology: 'grand-design spiral',
    redshift: 0.0015,
    environment: 'Interacting pair',
    imageQuery: 'Whirlpool Galaxy',
    summary: 'A classic spiral structure shaped by interaction with a companion galaxy.'
  },
  {
    id: 'sombrero',
    name: 'Sombrero Galaxy',
    ageGyr: 11.0,
    blackHoleMassSolar: 1000000000,
    stellarMassSolar: 800000000000,
    starFormationRate: 0.1,
    morphology: 'unbarred spiral',
    redshift: 0.0034,
    environment: 'Field',
    imageQuery: 'Sombrero Galaxy',
    summary: 'A bright bulge and dusty disk make this edge-on galaxy easy to recognize.'
  },
  {
    id: 'pinwheel',
    name: 'Pinwheel Galaxy',
    ageGyr: 9.8,
    blackHoleMassSolar: 26000,
    stellarMassSolar: 100000000000,
    starFormationRate: 2.0,
    morphology: 'face-on spiral',
    redshift: 0.0008,
    environment: 'Local Group outskirts',
    imageQuery: 'Pinwheel Galaxy',
    summary: 'A face-on spiral with extended arms and numerous bright H II regions.'
  },
  {
    id: 'black-eye',
    name: 'Black Eye Galaxy',
    ageGyr: 9.1,
    blackHoleMassSolar: 50000000,
    stellarMassSolar: 60000000000,
    starFormationRate: 1.1,
    morphology: 'spiral',
    redshift: 0.0023,
    environment: 'Field',
    imageQuery: 'Black Eye Galaxy',
    summary: 'A dramatic dust lane crosses its luminous core like a dark cosmic eye.'
  },
  {
    id: 'ngc-1300',
    name: 'NGC 1300',
    ageGyr: 10.4,
    blackHoleMassSolar: 70000000,
    stellarMassSolar: 110000000000,
    starFormationRate: 0.8,
    morphology: 'barred spiral',
    redshift: 0.0052,
    environment: 'Field',
    imageQuery: 'NGC 1300 galaxy',
    summary: 'A striking barred spiral with long, symmetrical arms extending from the center.'
  },
  {
    id: 'ngc-1365',
    name: 'NGC 1365',
    ageGyr: 10.7,
    blackHoleMassSolar: 800000000,
    stellarMassSolar: 250000000000,
    starFormationRate: 5.0,
    morphology: 'barred spiral',
    redshift: 0.0055,
    environment: 'Fornax Cluster',
    imageQuery: 'NGC 1365 galaxy',
    summary: 'A large barred spiral with strong star formation and a powerful central engine.'
  },
  {
    id: 'm87',
    name: 'Messier 87',
    ageGyr: 13.0,
    blackHoleMassSolar: 6500000000,
    stellarMassSolar: 2700000000000,
    starFormationRate: 0.05,
    morphology: 'giant elliptical',
    redshift: 0.0043,
    environment: 'Virgo Cluster',
    imageQuery: 'Messier 87 galaxy',
    summary: 'A giant elliptical galaxy famous for its supermassive black hole and relativistic jet.'
  },
  {
    id: 'leo-a',
    name: 'Leo A',
    ageGyr: 12.0,
    blackHoleMassSolar: 0,
    stellarMassSolar: 20000000,
    starFormationRate: 0.01,
    morphology: 'dwarf irregular',
    redshift: 0.001,
    environment: 'Local Group',
    imageQuery: 'Leo A galaxy',
    summary: 'A faint dwarf irregular with very sparse structure and a young stellar population.'
  },
  {
    id: 'cartwheel',
    name: 'Cartwheel Galaxy',
    ageGyr: 7.5,
    blackHoleMassSolar: 100000000,
    stellarMassSolar: 100000000000,
    starFormationRate: 5.5,
    morphology: 'ring galaxy',
    redshift: 0.03,
    environment: 'Field',
    imageQuery: 'Cartwheel Galaxy',
    summary: 'A ring galaxy formed by a dramatic collision that triggered a wave of star formation.'
  }
];

// Allow augmenting / filtering the galaxy database from an external JSON file.
const EXTERNAL_GALAXY_DB_PATH = 'data/galaxies.json';
let ORIGINAL_GALAXY_DATABASE = GALAXY_DATABASE.slice();

function redshiftToAgeGyr(z, options = {}) {
  // Approximate Lambda-CDM with H0=70 km/s/Mpc, Om=0.3, Ol=0.7
  // Numerical integration to estimate lookback time and galaxy age.
  if (typeof z !== 'number' || Number.isNaN(z)) return null;
  const H0 = 70; // km/s/Mpc
  const Om = 0.3;
  const Ol = 0.7;
  const Mpc_m = 3.085677581e22; // meters
  const H0_s = (H0 * 1000) / Mpc_m; // s^-1
  const secondsPerGyr = 3.15576e16; // seconds in a gigayear
  const tH0_Gyr = 1 / H0_s / secondsPerGyr; // Hubble time in Gyr

  function E(zp) {
    return Math.sqrt(Om * Math.pow(1 + zp, 3) + Ol);
  }

  const steps = options.steps || 1000;
  let sum = 0;
  const dz = z / steps;
  for (let i = 0; i <= steps; i++) {
    const zp = i * dz;
    const weight = i === 0 || i === steps ? 0.5 : 1;
    sum += weight * (1 / ((1 + zp) * E(zp)));
  }
  const integral = sum * dz;
  const lookbackGyr = tH0_Gyr * integral;
  const ageUniverseGyr = 13.8; // approximate
  const ageGyr = Math.max(0, ageUniverseGyr - lookbackGyr);
  return ageGyr;
}

async function loadExternalGalaxyDatabase() {
  try {
    const resp = await fetch(EXTERNAL_GALAXY_DB_PATH, { cache: 'no-store' });
    if (!resp.ok) {
      return;
    }

    const items = await resp.json();
    if (!Array.isArray(items)) return;

    for (const entry of items) {
      if (!entry || !entry.id) continue;
      const exists = GALAXY_DATABASE.find((g) => g.id === entry.id);
      if (exists) continue;

      const copy = { ...entry };
      if ((!copy.ageGyr || copy.ageGyr === null) && copy.redshift != null) {
        const z = Number(copy.redshift);
        const age = redshiftToAgeGyr(z);
        if (age != null) copy.ageGyr = Number(age.toFixed(2));
      }

      // Ensure required fields
      copy.name = copy.name || copy.id;
      copy.imageQuery = copy.imageQuery || copy.name;
      copy.summary = copy.summary || '';

      GALAXY_DATABASE.push(copy);
    }

    ORIGINAL_GALAXY_DATABASE = GALAXY_DATABASE.slice();
  } catch (e) {
    // ignore
  }
}

function applyAgeFilter(minAge, maxAge) {
  if (minAge == null && maxAge == null) {
    GALAXY_DATABASE = ORIGINAL_GALAXY_DATABASE.slice();
    return;
  }

  GALAXY_DATABASE = ORIGINAL_GALAXY_DATABASE.filter((g) => {
    if (typeof g.ageGyr !== 'number') return false;
    if (minAge != null && g.ageGyr < minAge) return false;
    if (maxAge != null && g.ageGyr > maxAge) return false;
    return true;
  });
}

const form = document.getElementById('controls');
const languageSelect = document.getElementById('language-select');
const endDateInput = document.getElementById('end-date');
const rangeHelp = document.getElementById('range-help');
const statusText = document.getElementById('status');
const loading = document.getElementById('loading');
const gallery = document.getElementById('gallery');
const spaceFact = document.getElementById('space-fact');

const modal = document.getElementById('modal');
const modalMedia = document.getElementById('modal-media');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalExplanation = document.getElementById('modal-explanation');
const modalLink = document.getElementById('modal-link');
const galaxyAgeMinInput = document.getElementById('age-min');
const galaxyAgeMaxInput = document.getElementById('age-max');
const galaxyAgeApplyButton = document.getElementById('age-apply');
const galaxyAgeResetButton = document.getElementById('age-reset');
const galaxyHelp = document.getElementById('galaxy-help');
const galaxySummary = document.getElementById('galaxy-summary');
const galaxyStatus = document.getElementById('galaxy-status');
const galaxyLoading = document.getElementById('galaxy-loading');
const galaxyAtlas = document.getElementById('galaxy-atlas');
const galaxyModal = document.getElementById('galaxy-modal');
const galaxyModalMedia = document.getElementById('galaxy-modal-media');
const galaxyModalTitle = document.getElementById('galaxy-modal-title');
const galaxyModalSubtitle = document.getElementById('galaxy-modal-subtitle');
const galaxyModalSummary = document.getElementById('galaxy-modal-summary');
const galaxyModalFacts = document.getElementById('galaxy-modal-facts');
const galaxyModalLink = document.getElementById('galaxy-modal-link');
const metaDescription = document.querySelector('meta[name="description"]');

let currentLocale = initialLocale;
let currentItems = [];
let currentRange = null;
let activeModalItem = null;
let activeModalSourceItem = null;

let lastTrigger = null;
let galleryRenderToken = 0;
let galaxyRenderToken = 0;

const galaxyImageCache = new Map();

function getPreferredLocale() {
  const browserLocales = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
  for (const browserLocale of browserLocales) {
    if (browserLocale.toLowerCase().startsWith('zh')) {
      return 'zh-Hans';
    }
    const matchedLocale = supportedLocales.find((locale) => browserLocale.toLowerCase().startsWith(locale.toLowerCase()));
    if (matchedLocale) {
      return matchedLocale;
    }
  }

  return 'en';
}

function getLocaleStrings(locale = currentLocale) {
  return LOCALES[locale] || LOCALES.en;
}

function getTranslationTargetLocale(locale = currentLocale) {
  return translationTargetLocales[locale] || locale;
}

function getDateFormatter(locale = currentLocale) {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function toISODate(value) {
  return value.toISOString().split('T')[0];
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function pickRandomFact() {
  const strings = getLocaleStrings();
  const index = Math.floor(Math.random() * strings.facts.length);
  spaceFact.textContent = strings.facts[index];
}

function clampEndDate() {
  const today = new Date();
  const maxEnd = toISODate(today);
  endDateInput.max = maxEnd;
  const preferred = toISODate(today);
  endDateInput.value = preferred;
  rangeHelp.textContent = getLocaleStrings().rangeWillShow(formatDateLabel(preferred));
}

function setLoading(isLoading) {
  loading.hidden = !isLoading;
  gallery.hidden = isLoading;
}

function formatDateLabel(dateString) {
  return getDateFormatter().format(new Date(`${dateString}T00:00:00`));
}

function splitTextForTranslation(text, maxLength = 430) {
  const chunks = [];
  const sentences = text
    .replace(/\s+/g, ' ')
    .match(/[^.!?]+[.!?]*\s*/g) || [text];

  let currentChunk = '';

  for (const sentence of sentences) {
    const cleanedSentence = sentence.trim();
    if (!cleanedSentence) {
      continue;
    }

    if (cleanedSentence.length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      const words = cleanedSentence.split(/\s+/);
      let wordChunk = '';
      for (const word of words) {
        const nextChunk = wordChunk ? `${wordChunk} ${word}` : word;
        if (nextChunk.length > maxLength) {
          if (wordChunk) {
            chunks.push(wordChunk.trim());
          }
          wordChunk = word;
        } else {
          wordChunk = nextChunk;
        }
      }

      if (wordChunk) {
        chunks.push(wordChunk.trim());
      }
      continue;
    }

    const nextChunk = currentChunk ? `${currentChunk} ${cleanedSentence}` : cleanedSentence;
    if (nextChunk.length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = cleanedSentence;
    } else {
      currentChunk = nextChunk;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [text];
}

async function translateChunk(text, targetLocale) {
  const cacheKey = `${targetLocale}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  const url = new URL(TRANSLATION_API_URL);
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', `en|${targetLocale}`);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Translation request failed.');
  }

  const data = await response.json();
  const translatedText = data?.responseData?.translatedText || text;
  translationCache.set(cacheKey, translatedText);
  return translatedText;
}

async function translateText(text, locale) {
  const targetLocale = getTranslationTargetLocale(locale);
  if (locale === 'en' || targetLocale === 'en' || !text) {
    return text;
  }

  const chunks = splitTextForTranslation(text);
  const translatedChunks = [];

  try {
    for (const chunk of chunks) {
      translatedChunks.push(await translateChunk(chunk, targetLocale));
    }
    return translatedChunks.join(' ').replace(/\s+([,.;:!?])/g, '$1').trim();
  } catch (error) {
    return text;
  }
}

async function translateApodItem(item, locale) {
  try {
    const translatedTitle = await translateText(item.title, locale);
    const translatedExplanation = await translateText(item.explanation, locale);

    return {
      ...item,
      sourceItem: item.sourceItem || item,
      title: translatedTitle,
      explanation: translatedExplanation,
      translatedLocale: locale
    };
  } catch (error) {
    return {
      ...item,
      sourceItem: item.sourceItem || item,
      translatedLocale: locale
    };
  }
}

async function translateGalleryItems(items, locale) {
  return Promise.all(items.map((item) => translateApodItem(item, locale)));
}

function updateDocumentLanguage(locale) {
  const strings = getLocaleStrings(locale);
  const root = document.documentElement;
  root.dataset.locale = locale;
  document.title = strings.pageTitle;
  if (metaDescription) {
    metaDescription.setAttribute('content', strings.description);
  }

  document.body.dataset.locale = locale;
  document.documentElement.style.setProperty('--body-font', getBodyFontStack(locale));
  document.documentElement.style.setProperty('--display-font', getDisplayFontStack(locale));
}

function buildVideoEmbedUrl(mediaUrl) {
  try {
    const parsed = new URL(mediaUrl);
    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}`;
      }
    }

    if (parsed.hostname === 'youtu.be') {
      return `https://www.youtube-nocookie.com/embed${parsed.pathname}`;
    }

    if (parsed.hostname.includes('vimeo.com')) {
      return mediaUrl.replace('vimeo.com/', 'player.vimeo.com/video/');
    }
  } catch (error) {
    return null;
  }

  return null;
}

function getBodyFontStack(locale) {
  if (locale === 'ja') {
    return '"Hiragino Sans", "Yu Gothic", "Meiryo", "Noto Sans JP", system-ui, sans-serif';
  }

  if (locale === 'ko') {
    return '"Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", system-ui, sans-serif';
  }

  if (locale === 'zh-Hans') {
    return '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", system-ui, sans-serif';
  }

  return '"Inter", "Segoe UI", system-ui, sans-serif';
}

function getDisplayFontStack(locale) {
  if (locale === 'ja') {
    return '"Hiragino Sans", "Yu Gothic", "Meiryo", "Noto Sans JP", system-ui, sans-serif';
  }

  if (locale === 'ko') {
    return '"Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", system-ui, sans-serif';
  }

  if (locale === 'zh-Hans') {
    return '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", system-ui, sans-serif';
  }

  return '"Orbitron", "Inter", "Segoe UI", system-ui, sans-serif';
}

function updateStaticText(locale = currentLocale) {
  const strings = getLocaleStrings(locale);

  document.querySelector('label[for="language-select"]').firstChild.textContent = `${strings.languageLabel}`;
  document.querySelector('label[for="end-date"]').firstChild.textContent = `${strings.endDateLabel}`;
  document.querySelector('label[for="end-date"] span').textContent = strings.endDateHint;

  document.querySelector('#controls button[type="submit"]').textContent = strings.loadGallery;
  document.querySelector('#fact-title').textContent = strings.factTitle;
  document.querySelector('#gallery-title').textContent = strings.galleryTitle;
  document.querySelector('#status').textContent = strings.statusIdle;
  document.querySelector('#loading p').textContent = strings.loading;
  document.querySelector('#modal-title').setAttribute('data-placeholder', strings.modalKicker);
  document.querySelector('.modal-close').setAttribute('aria-label', strings.modalCloseLabel);
  document.querySelector('#modal-link').textContent = strings.openOriginalMedia;
  document.querySelector('.fact-panel .section-label').textContent = strings.factKicker;
  document.querySelector('.gallery-section .section-label').textContent = strings.galleryKicker;
  document.querySelector('.modal-content .section-label').textContent = strings.modalKicker;
  document.querySelector('#hero-title').textContent = strings.heroTitle;
  document.querySelector('.hero-copy .eyebrow').textContent = strings.eyebrow;
  document.querySelector('.hero-text').textContent = strings.heroText;
  document.querySelector('#space-fact').textContent = strings.factLoading;
  rangeHelp.textContent = strings.rangeWillShow(formatDateLabel(endDateInput.value || toISODate(new Date())));
}

function createVideoPlaceholder(item) {
  const strings = getLocaleStrings();
  const wrapper = document.createElement('div');
  wrapper.className = 'video-placeholder';

  const content = document.createElement('div');
  const mark = document.createElement('div');
  mark.className = 'play-mark';
  mark.setAttribute('aria-hidden', 'true');

  const heading = document.createElement('strong');
  heading.textContent = strings.videoLabel;

  const title = document.createElement('p');
  title.textContent = item.title;

  content.append(mark, heading, title);
  wrapper.append(content);
  return wrapper;
}

function createGalleryCard(item) {
  const strings = getLocaleStrings();
  const article = document.createElement('article');
  article.className = 'gallery-item';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'gallery-trigger';
  trigger.setAttribute('aria-label', strings.openDetailsFor(item.title));
  trigger.addEventListener('click', () => openModal(item, trigger));

  const media = document.createElement('div');
  media.className = 'gallery-media';

  if (item.media_type === 'video') {
    const placeholder = createVideoPlaceholder(item);
    media.append(placeholder);
    const badge = document.createElement('span');
    badge.className = 'video-chip';
    badge.textContent = strings.videoLabel;
    media.append(badge);
  } else {
    const image = document.createElement('img');
    image.src = item.url;
    image.alt = item.title;
    image.loading = 'lazy';
    media.append(image);
  }

  const body = document.createElement('div');
  body.className = 'gallery-body';

  const title = document.createElement('h3');
  title.textContent = item.title;

  const date = document.createElement('time');
  date.dateTime = item.date;
  date.textContent = formatDateLabel(item.date);

  body.append(title, date);
  trigger.append(media, body);
  article.append(trigger);
  return article;
}

function renderGallery(items) {
  gallery.replaceChildren(...items.map(createGalleryCard));
}

async function renderTranslatedGallery(items, locale, options = {}) {
  const token = ++galleryRenderToken;
  const strings = getLocaleStrings(locale);
  const shouldShowLoading = options.showLoading === true;

  if (shouldShowLoading) {
    setLoading(true);
    statusText.textContent = strings.loading;
  }

  try {
    const translatedItems = await translateGalleryItems(items, locale);
    if (token !== galleryRenderToken) {
      return null;
    }

    renderGallery(translatedItems);
    return translatedItems;
  } finally {
    if (shouldShowLoading && token === galleryRenderToken) {
      setLoading(false);
    }
  }
}

function getDateRange(endDateString) {
  const endDate = new Date(`${endDateString}T00:00:00`);
  const startDate = addDays(endDate, -(DAYS_TO_SHOW - 1));
  return {
    startDate: toISODate(startDate),
    endDate: toISODate(endDate)
  };
}

async function fetchApodRange(startDate, endDate) {
  const url = new URL(API_URL);
  url.searchParams.set('api_key', DEFAULT_API_KEY);
  url.searchParams.set('start_date', startDate);
  url.searchParams.set('end_date', endDate);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('NASA APOD request failed.');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

function describeRange(startDate, endDate) {
  return getLocaleStrings().showingRange(formatDateLabel(startDate), formatDateLabel(endDate));
}

function openModal(item, trigger) {
  const strings = getLocaleStrings();
  lastTrigger = trigger;
  activeModalItem = item;
  activeModalSourceItem = item.sourceItem || item;
  modalTitle.textContent = item.title;
  modalDate.textContent = formatDateLabel(item.date);
  modalExplanation.textContent = item.explanation;

  modalLink.hidden = true;
  modalLink.removeAttribute('href');
  modalLink.removeAttribute('target');
  modalLink.removeAttribute('rel');

  modalMedia.replaceChildren();

  if (item.media_type === 'video') {
    const embedUrl = buildVideoEmbedUrl(item.url);
    if (embedUrl) {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.title = item.title;
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      modalMedia.append(iframe);
    } else {
      const fallback = document.createElement('div');
      fallback.className = 'video-placeholder';

      const content = document.createElement('div');
      const mark = document.createElement('div');
      mark.className = 'play-mark';
      mark.setAttribute('aria-hidden', 'true');

      const heading = document.createElement('strong');
      heading.textContent = strings.videoLabel;

      const copy = document.createElement('p');
      copy.textContent = strings.videoFallback;

      content.append(mark, heading, copy);
      fallback.append(content);
      modalMedia.append(fallback);
    }

    modalLink.href = item.url;
    modalLink.hidden = false;
    modalLink.textContent = strings.openOriginalVideo;
    modalLink.target = '_blank';
    modalLink.rel = 'noreferrer noopener';
  } else {
    const image = document.createElement('img');
    image.src = item.hdurl || item.url;
    image.alt = item.title;
    modalMedia.append(image);
  }

  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  const closeButton = modal.querySelector('.modal-close');
  closeButton.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
  modalMedia.replaceChildren();
  modalLink.hidden = true;
  activeModalItem = null;
  activeModalSourceItem = null;
  if (lastTrigger) {
    lastTrigger.focus();
    lastTrigger = null;
  }
}

async function refreshVisibleContent() {
  updateDocumentLanguage(currentLocale);
  updateStaticText(currentLocale);

  if (currentItems.length > 0) {
    await renderTranslatedGallery(currentItems, currentLocale, { showLoading: false });
    if (currentRange) {
      statusText.textContent = describeRange(currentRange.startDate, currentRange.endDate);
      rangeHelp.textContent = getLocaleStrings().loadedEntries(
        currentItems.length,
        formatDateLabel(currentRange.endDate)
      );
    }
  }

  pickRandomFact();

  if (!modal.hidden && activeModalSourceItem) {
    const translatedActiveItem = await translateApodItem(activeModalSourceItem, currentLocale);
    openModal(translatedActiveItem, lastTrigger || document.activeElement);
  }
}

async function applyLocale(locale) {
  if (!LOCALES[locale]) {
    locale = 'en';
  }

  currentLocale = locale;
  languageSelect.value = locale;
  await refreshVisibleContent();
}

async function loadGallery(endDateString) {
  const strings = getLocaleStrings();
  const range = getDateRange(endDateString);

  if (range.startDate < EARLIEST_END_DATE) {
    statusText.textContent = strings.selectLaterEndDate;
    return;
  }

  setLoading(true);
  statusText.textContent = strings.loading;

  try {
    const items = await fetchApodRange(range.startDate, range.endDate);
    currentItems = items;
    currentRange = range;
    await renderTranslatedGallery(items, currentLocale, { showLoading: false });
    statusText.textContent = describeRange(range.startDate, range.endDate);
    rangeHelp.textContent = strings.loadedEntries(items.length, formatDateLabel(range.endDate));
  } catch (error) {
    gallery.replaceChildren();
    currentItems = [];
    currentRange = null;
    statusText.textContent = strings.loadError;
    rangeHelp.textContent = error instanceof Error ? error.message : strings.unexpectedError;
  } finally {
    setLoading(false);
  }
}

function formatGalaxyAge(ageGyr) {
  return `${ageGyr.toFixed(1)} billion years`;
}

function formatSolarMass(value) {
  return `${new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(value)} M☉`;
}

function formatRedshift(value) {
  return value === 0 ? 'z = 0' : `z = ${value.toFixed(4)}`;
}

function setGalaxyLoading(isLoading) {
  galaxyLoading.hidden = !isLoading;
  galaxyAtlas.setAttribute('aria-busy', String(isLoading));
}

async function fetchGalaxyImage(galaxy) {
  if (galaxyImageCache.has(galaxy.imageQuery)) {
    return galaxyImageCache.get(galaxy.imageQuery);
  }
  // If the galaxy entry already provides an image URL (from external DB), use it.
  if (galaxy.imageUrl) {
    const provided = Promise.resolve({ imageUrl: galaxy.localImage || galaxy.imageUrl, sourceUrl: galaxy.sourceUrl || galaxy.imageUrl });
    galaxyImageCache.set(galaxy.imageQuery, provided);
    return provided;
  }

  const request = (async () => {
    try {
      const url = new URL('https://images-api.nasa.gov/search');
      url.searchParams.set('q', galaxy.imageQuery);
      url.searchParams.set('media_type', 'image');

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('NASA image search failed.');
      }

      const data = await response.json();
      const item = data?.collection?.items?.find((entry) => Array.isArray(entry.links) && entry.links.length > 0);
      const imageUrl = item?.links?.find((link) => link.rel === 'preview' || link.rel === 'canonical')?.href || null;
      const sourceUrl = imageUrl || item?.href || null;

      return {
        imageUrl,
        sourceUrl
      };
    } catch (error) {
      return {
        imageUrl: null,
        sourceUrl: null
      };
    }
  })();

  galaxyImageCache.set(galaxy.imageQuery, request);
  return request;
}

function createGalaxyPlaceholder(galaxy) {
  const placeholder = document.createElement('div');
  placeholder.className = 'video-placeholder image-placeholder';

  const content = document.createElement('div');
  const heading = document.createElement('strong');
  heading.textContent = galaxy.name;

  const body = document.createElement('p');
  body.textContent = 'Loading NASA archive image...';

  content.append(heading, body);
  placeholder.append(content);
  return placeholder;
}

function createGalaxyCard(galaxy) {
  const article = document.createElement('article');
  article.className = 'gallery-item galaxy-card';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'gallery-trigger';
  trigger.setAttribute('aria-label', `Open details for ${galaxy.name}`);
  trigger.addEventListener('click', () => openGalaxyModal(galaxy, trigger));

  const media = document.createElement('div');
  media.className = 'gallery-media';
  const placeholder = createGalaxyPlaceholder(galaxy);
  const badge = document.createElement('span');
  badge.className = 'galaxy-score';
  badge.textContent = formatGalaxyAge(galaxy.ageGyr);
  media.append(placeholder, badge);

  const body = document.createElement('div');
  body.className = 'gallery-body';

  const title = document.createElement('h3');
  title.textContent = galaxy.name;

  const details = document.createElement('p');
  details.textContent = `${formatGalaxyAge(galaxy.ageGyr)} • ${galaxy.morphology}`;

  const summary = document.createElement('p');
  summary.textContent = galaxy.summary;

  body.append(title, details, summary);
  trigger.append(media, body);
  article.append(trigger);
  return article;
}

async function hydrateGalaxyCard(card, galaxy, token) {
  const media = card.querySelector('.gallery-media');
  const badge = card.querySelector('.galaxy-score');
  const placeholder = media?.querySelector('.image-placeholder');
  const asset = await fetchGalaxyImage(galaxy);

  if (token !== galaxyRenderToken || !media) {
    return;
  }

  if (asset.imageUrl) {
    const image = document.createElement('img');
    image.src = asset.imageUrl;
    image.alt = galaxy.name;
    image.loading = 'lazy';
    media.replaceChildren(image, badge);
  } else if (placeholder) {
    placeholder.textContent = 'Image unavailable';
  }
}

function renderGalaxyFacts(galaxy) {
  const facts = [
    ['Age', formatGalaxyAge(galaxy.ageGyr)],
    ['Central black hole', formatSolarMass(galaxy.blackHoleMassSolar)],
    ['Stellar mass', formatSolarMass(galaxy.stellarMassSolar)],
    ['Star formation', `${galaxy.starFormationRate.toFixed(2)} M☉/yr`],
    ['Structure', galaxy.morphology],
    ['Environment', `${galaxy.environment} • ${formatRedshift(galaxy.redshift)}`]
  ];

  galaxyModalFacts.replaceChildren(
    ...facts.map(([label, value]) => {
      const fact = document.createElement('p');
      fact.className = 'modal-fact';
      fact.innerHTML = `<strong>${label}:</strong> ${value}`;
      return fact;
    })
  );
}

function parseGalaxyAgeBound(value) {
  if (value == null || value === '') {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getAgeFilterBounds() {
  let minAge = parseGalaxyAgeBound(galaxyAgeMinInput?.value);
  let maxAge = parseGalaxyAgeBound(galaxyAgeMaxInput?.value);

  if (minAge != null && maxAge != null && minAge > maxAge) {
    [minAge, maxAge] = [maxAge, minAge];
  }

  return { minAge, maxAge };
}

function getFilteredGalaxies() {
  const { minAge, maxAge } = getAgeFilterBounds();

  return GALAXY_DATABASE
    .filter((galaxy) => {
      if (typeof galaxy.ageGyr !== 'number') {
        return false;
      }

      if (minAge != null && galaxy.ageGyr < minAge) {
        return false;
      }

      if (maxAge != null && galaxy.ageGyr > maxAge) {
        return false;
      }

      return true;
    })
    .slice()
    .sort((left, right) => {
      if (left.ageGyr !== right.ageGyr) {
        return left.ageGyr - right.ageGyr;
      }

      return left.name.localeCompare(right.name);
    });
}

function updateGalaxySummary(totalMatches) {
  const { minAge, maxAge } = getAgeFilterBounds();
  const parts = [];

  if (minAge != null && maxAge != null) {
    parts.push(`Age range: ${minAge.toFixed(1)}-${maxAge.toFixed(1)} Gyr`);
  } else if (minAge != null) {
    parts.push(`Age ${minAge.toFixed(1)} Gyr and older`);
  } else if (maxAge != null) {
    parts.push(`Age ${maxAge.toFixed(1)} Gyr and younger`);
  } else {
    parts.push('All galaxies sorted by age');
  }

  galaxySummary.textContent = `${parts.join(' • ')}.`;
  galaxyStatus.textContent = `${totalMatches} galaxies match the current age filter.`;
}

function openGalaxyModal(galaxy, trigger) {
  activeGalaxyModalItem = galaxy;
  activeGalaxyTrigger = trigger;

  galaxyModalTitle.textContent = galaxy.name;
  galaxyModalSubtitle.textContent = `${formatGalaxyAge(galaxy.ageGyr)} • ${galaxy.morphology}`;
  galaxyModalSummary.textContent = galaxy.summary;
  renderGalaxyFacts(galaxy);

  galaxyModalLink.hidden = true;
  galaxyModalLink.removeAttribute('href');

  galaxyModalMedia.replaceChildren();
  const placeholder = createGalaxyPlaceholder(galaxy);
  galaxyModalMedia.append(placeholder);

  fetchGalaxyImage(galaxy).then((asset) => {
    if (activeGalaxyModalItem?.id !== galaxy.id || galaxyModal.hidden) {
      return;
    }

    if (asset.imageUrl) {
      const image = document.createElement('img');
      image.src = asset.imageUrl;
      image.alt = galaxy.name;
      galaxyModalMedia.replaceChildren(image);
      galaxyModalLink.href = asset.sourceUrl || asset.imageUrl;
      galaxyModalLink.hidden = false;
    } else {
      placeholder.textContent = 'Image unavailable';
    }
  });

  galaxyModal.hidden = false;
  document.body.style.overflow = 'hidden';
  galaxyModal.querySelector('.modal-close').focus();
}

function closeGalaxyModal() {
  galaxyModal.hidden = true;
  document.body.style.overflow = '';
  galaxyModalMedia.replaceChildren();
  galaxyModalLink.hidden = true;
  galaxyModalLink.removeAttribute('href');
  activeGalaxyModalItem = null;

  if (activeGalaxyTrigger) {
    activeGalaxyTrigger.focus();
    activeGalaxyTrigger = null;
  }
}

async function renderGalaxyAtlas() {
  const token = ++galaxyRenderToken;

  setGalaxyLoading(true);
  const matches = getFilteredGalaxies();
  updateGalaxySummary(matches.length);

  const cards = matches.map((galaxy) => createGalaxyCard(galaxy));
  galaxyAtlas.replaceChildren(...cards);

  await Promise.all(cards.map((card, index) => hydrateGalaxyCard(card, matches[index], token)));

  if (token === galaxyRenderToken) {
    setGalaxyLoading(false);
    updateGalaxySummary(matches.length);
  }
}

function initializeGalaxyAtlas() {
  renderGalaxyAtlas();
}

languageSelect.addEventListener('change', (event) => {
  const target = event.target;
  if (target instanceof HTMLSelectElement) {
    applyLocale(target.value);
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  loadGallery(endDateInput.value);
});

modal.addEventListener('click', (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.hasAttribute('data-close-modal')) {
    closeModal();
  }
});

galaxyAgeApplyButton?.addEventListener('click', () => {
  renderGalaxyAtlas();
});

galaxyAgeMinInput?.addEventListener('input', () => {
  renderGalaxyAtlas();
});

galaxyAgeMaxInput?.addEventListener('input', () => {
  renderGalaxyAtlas();
});

galaxyAgeResetButton?.addEventListener('click', () => {
  if (galaxyAgeMinInput) {
    galaxyAgeMinInput.value = '';
  }

  if (galaxyAgeMaxInput) {
    galaxyAgeMaxInput.value = '';
  }

  renderGalaxyAtlas();
});

galaxyModal.addEventListener('click', (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.hasAttribute('data-close-galaxy-modal')) {
    closeGalaxyModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) {
    closeModal();
  }

  if (event.key === 'Escape' && !galaxyModal.hidden) {
    closeGalaxyModal();
  }
});

(async function boot() {
  await applyLocale(initialLocale);
  clampEndDate();

  // Try to load external galaxy records (data/galaxies.json) and merge.
  await loadExternalGalaxyDatabase();

  loadGallery(endDateInput.value);
  initializeGalaxyAtlas();
})();