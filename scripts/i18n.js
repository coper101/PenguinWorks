(function () {
    const supportedLanguages = ["en", "de", "zh-Hans", "tr", "fil"];
    const storageKey = "data-pill-language";

    const translations = {
        en: {
            "footer.support": "Support",
            "footer.help": "Help",
            "footer.whatsNew": "What's New?",
            "home.title": "Data Pill",
            "home.subtitle": "Effortlessly Monitor Data Usage, Wherever You Are!",
            "home.plan.title": "Data Plan Management",
            "home.plan.description": "Tailor your data plan, set usage limits, and visualize your data consumption with our unique pill-shaped bar.",
            "home.flexible.title": "Flexible Options for Non-Data Plans",
            "home.flexible.description": "Track your data with daily budgets, even without a traditional data plan.",
            "home.widgets.title": "Monitor Anywhere, Anytime",
            "home.widgets.description": "Stay informed at a glance with widgets on your home and lock screens.",
            "support.title": "Support",
            "support.card.title": "Need help?",
            "support.emailIntro": "For any feedback or issues encountered, contact us via email:",
            "support.appSettings": "You may also go to 'Report a Bug' or 'Request a Feature' in the app settings.",
            "lang.en": "English",
            "lang.de": "German",
            "lang.tr": "Turkish",
            "lang.zh": "Chinese",
            "lang.fil": "Filipino",
            "help.title": "Help",
            "help.meta": "By PenguinWorksCo<br>Last Updated: 24 Jul 2026",
            "help.guide.title": "Data Pill Guide",
            "help.guide.description": "Quick answers for setting up your data plan, reading your pill, adding widgets, and keeping your records backed up.",
            "help.topic.basics": "Basics",
            "help.topic.streak": "Streak",
            "help.topic.pill": "Pill",
            "help.topic.widget": "Widget",
            "help.topic.notifications": "Notifications",
            "help.topic.backup": "Backup",
            "help.topic.data": "Data",
            "help.topic.languages": "Languages",
            "help.basics.dataPlan.q": "What is a Data Plan?",
            "help.basics.dataPlan.a": "A data plan is a service provided by mobile carriers, offering users internet access on their mobile devices for a set fee.",
            "help.basics.setPlan.q": "How to Set the Data Plan?",
            "help.basics.setPlan.a": "You need to set the period and the data amount your plan has. All of this can be edited from the Data Plan card.",
            "help.basics.disablePlan.q": "How to Disable Data Plan?",
            "help.basics.disablePlan.a": "You can disable the data plan using the switch if you just want to monitor data on a daily basis.",
            "help.basics.period.q": "Difference Between Manual & Auto Period?",
            "help.basics.period.auto": "<strong>Auto:</strong> Automatically sets the next billing cycle or period.",
            "help.basics.period.manual": "<strong>Manual:</strong> You set the period yourself.",
            "help.basics.period.note": "<strong>Note:</strong> Plan Period dates will be highlighted in red if today's date is not in range with the period selected.",
            "help.basics.dailyPlan.q": "Difference Between Daily & Plan Usage?",
            "help.basics.dailyPlan.daily": "Daily usage refers to the amount of data consumed within a single day.",
            "help.basics.dailyPlan.plan": "Plan usage covers the total data usage within your mobile carrier billing cycle.",
            "help.basics.dataAmount.q": "What is Data Amount?",
            "help.basics.dataAmount.a": "It is the maximum amount of internet data you can use within your billing cycle without incurring extra charges or experiencing reduced speeds.",
            "help.basics.untracked.q": "What is Untracked Amount?",
            "help.basics.untracked.a": "It is the amount of data usage from your mobile internet plan that occurred before you installed Data Pill. This added amount will be included in your total usage for the current period.",
            "help.basics.dailyLimit.q": "What is Daily Limit?",
            "help.basics.dailyLimit.a": "The daily threshold set by the app to notify you if you've exceeded the daily limit through a notification.",
            "help.basics.planLimit.q": "What is Plan Limit?",
            "help.basics.planLimit.a": "Similar to the Daily Limit, but applies to the entire plan period.",
            "help.streak.what.q": "What is a Streak?",
            "help.streak.what.a1": "A Streak tracks how many consecutive days you have stayed within your daily usage limit. Each day you avoid exceeding your daily limit, your streak continues.",
            "help.streak.what.a2": "Streaks require a valid Daily Limit. If Data Plan is enabled, today also needs to be inside your current plan period.",
            "help.streak.rewards.q": "How do Streak Rewards work?",
            "help.streak.rewards.a1": "When you reach certain milestones, such as 7, 14, 30, or 60 days, you can claim a reward. Each reward unlocks Super Trial for 7 days, so you can experience Data Pill's premium features.",
            "help.streak.rewards.a2": "If you claim another reward while Super Trial is active, the app extends your trial.",
            "help.pill.what.q": "What is a Pill?",
            "help.pill.what.a": "A Pill is a visual indicator that represents your daily or plan usage. It allows you to quickly see your data consumption.",
            "help.pill.week.q": "How to Show Daily Usage for the Week?",
            "help.pill.week.a": "Tap the Pill, then swipe left to view daily usage for the past 7 days.",
            "help.pill.period.q": "How to Show All Daily Usage for the Current Period?",
            "help.pill.period.a": "Tap the Pill, then scroll down to see the full breakdown of your usage for the current billing period.",
            "help.widget.home.q": "How to Add Widget to Homescreen?",
            "help.widget.home.a": "To add a widget on the homescreen, long-press the home screen then tap the + button at the top-right corner of the screen. Search \"Data Pill\" widget and choose the size you prefer.",
            "help.widget.lock.q": "How to Add Widget to Lockscreen?",
            "help.widget.lock.a": "To add a widget on the lockscreen, long-press the lockscreen then tap \"Customize\". Tap the bottom widget area and add the \"Data Pill\" widget.",
            "help.widget.standby.q": "How to Add to StandBy?",
            "help.widget.standby.a": "To add a widget on StandBy screen, long-press the screen while on StandBy display. Unlock your phone then tap the + button at the top-left corner of the screen. Search \"Data Pill\" widget and tap \"Add Widget\" then tap \"Done\".",
            "help.widget.planUsage.q": "Why I can't see the Plan Usage?",
            "help.widget.planUsage.a1": "You need to edit the widget from the homescreen by long-pressing it. Set Usage Type to Daily to see today's usage, or Plan to see your overall usage for the current period or cycle.",
            "help.widget.planUsage.a2": "For small widgets, you can also change Small Widget to Data Usage or Days Left. You can add another widget with a different configuration, such as days left in the period.",
            "help.widget.notUpdating.q": "Why Widget is not Updating?",
            "help.widget.notUpdating.a": "Widgets typically update every 5 minutes. However, updates might be delayed if you're not actively using the app or if you've reached the daily limit of 40-60 refreshes.",
            "help.widget.blank.q": "Why My Widget is Blank / Black?",
            "help.widget.blank.a": "On iOS 17, the widget may turn black after updating the app. This is an iOS issue. To fix this, restart your device or remove and re-add the widget on the homescreen.",
            "help.notifications.notWorking.q": "Why Notifications are Not Working?",
            "help.notifications.notWorking.a": "Ensure notifications are enabled in both places:",
            "help.notifications.device": "Device Settings:",
            "help.notifications.app": "App Settings:",
            "help.path.deviceNotifications": "Settings > Data Pill > Notifications > Allow Notifications",
            "help.path.appNotifications": "Settings > Notifications > Daily Usage & Plan Usage",
            "help.backup.how.q": "How to Backup & Restore my Records?",
            "help.backup.how.a1": "To backup your data, enable \"Data Pill\" backup in Settings.",
            "help.path.icloud": "Settings > [Your Name] > [This Device] > iCloud Backup > [This Device Backup] > Enable \"Data Pill\"",
            "help.backup.how.a2": "With Super Pill, you can also back up your data manually by exporting it to a <strong>CSV file</strong> from Records.",
            "help.path.exportCsv": "Settings > Show All Records > Export to CSV",
            "help.backup.csv.intro": "When restoring from a CSV file, the first two columns are required. Extra columns from Data Pill exports are accepted and ignored during import.",
            "help.backup.csv.columns": "Required columns: <strong>Date</strong> and <strong>Used Amount in MB</strong>.",
            "help.backup.csv.date": "Date format should be d MMM yyyy. Month names can be in German, Turkish, Chinese, Filipino, or English.",
            "help.backup.csv.amount": "Used Amount in MB must be a valid number.",
            "help.backup.csv.structure": "Keep the file structure exactly the same for smooth importing.",
            "help.data.accuracy.q": "Why is the Usage on App Not Accurate?",
            "help.data.accuracy.a": "There might be a +/- 1-5 MB difference due to API limitations. Check your phone's settings for exact data usage.",
            "help.data.speed.q": "How does the App Calculate the Speed?",
            "help.data.speed.a1": "When \"Tracking Data Amount Throughout the Day\" is enabled in Settings, the app attempts to record the amount of data used every 5 minutes, or based on the selected time interval. However, this tracking is not always precise, as widget updates depend on the system's refresh schedule. If some intervals are missed, the app averages the available data.",
            "help.path.dataUpdates": "Einstellungen > Datenaktualisierungen > Datenmenge über den Tag verfolgen",
            "help.data.speed.a2": "For example, if you've used 0.1 MB over the last 3 intervals, the app will calculate the average as 0.1 MB / 3 = 0.033 MB. All non-cumulative data points collected throughout the day are averaged and displayed as the speed, such as x MB / 5 min.",
            "help.data.track.q": "Why it is not tracking my data usage?",
            "help.data.track.a1": "To track your data usage while the app is not open, you need to add the widget to your home screen or lock screen.",
            "help.data.track.a2": "For throughout-the-day tracking and speed statistics, you also need Super Pill and the Data Updates tracking setting enabled.",
            "help.data.track.a3": "The widget updates your data usage only when it is refreshed by the system. If the widget isn't added or hasn't been refreshed, the data won't update.",
            "help.languages.title": "Languages Supported",
            "help.languages.change": "To change the app language, go to:",
            "help.path.language": "Device Settings > Apps > Data Pill > Language > Select Language",
            "whatsNew.title": "What's New?",
            "whatsNew.v290.title": "Streaks, Rewards & Dynamic Themes",
            "whatsNew.v290.streaks": "<strong>Daily Streaks:</strong><br/>Stay in the safe zone and build a streak as you manage your data plan day by day.",
            "whatsNew.v290.rewards": "<strong>Streak Rewards:</strong><br/>Hit streak milestones to unlock Super Pill trial days and keep your progress going.",
            "whatsNew.v290.daysLeft": "<strong>Days Left:</strong><br/>See how many days are left in your plan directly in the app and on your widgets.",
            "whatsNew.v290.themes": "<strong>Dynamic Themes:</strong><br/>Choose System, Dark, or Light mode, with improved widget colors that adapt to your look.",
            "whatsNew.v290.homeWidgets": "<strong>Smarter Home & Widgets:</strong><br/>Streaks, data status, days left, and Super Pill subscription details are easier to check at a glance.",
            "whatsNew.v270.title": "Startup Guide & Import Data",
            "whatsNew.v270.guide": "<strong>New Startup Guide:</strong><br/>Get started quickly with our new step-by-step guide.",
            "whatsNew.v270.import": "<strong>Import Data:</strong><br/>Easily import your existing data using CSV files.",
            "whatsNew.v250.title": "Visualize your data every few minutes",
            "whatsNew.v250.description": "You can now enable tracking to see how much data you've used every X minutes. Watch your data usage trend over time with our new line chart, so you stay in control and avoid surprises.",
            "whatsNew.v240.title": "Custom Particles & New Pill Shapes",
            "whatsNew.v240.description": "Get creative with our new interactive pill feature!",
            "whatsNew.v240.particles": "<strong>Animated Particles:</strong><br/>Add particles that move up, down, or in any direction inside your pills.",
            "whatsNew.v240.control": "<strong>Full Control:</strong><br/>Customize particle shape, speed, opacity, and more.",
            "whatsNew.v240.options": "<strong>More Pill Options:</strong><br/>Choose from basic shapes to fun emoji pills.",
            "whatsNew.v230.title": "App Alerts & Tips",
            "whatsNew.v230.description": "We've added smart alerts and helpful tips to help you stay in control of your data usage!",
            "whatsNew.v230.alerts": "<strong>Real-time Alerts:</strong><br/>Get notified when you reach or exceed your mobile data limit - right inside the app.",
            "whatsNew.v230.tips": "<strong>Smart Tips to Save Data:</strong><br/>Discover easy, practical ways to reduce data usage and avoid overages.",
            "whatsNew.v220.title": "More Widgets on Lockscreen & Homescreen",
            "whatsNew.v220.description": "View weekly usage on your homescreen and free up space for other widgets on your lockscreen with the new compact widget",
            "whatsNew.v210.title": "Record History & Widget Customization",
            "whatsNew.v210.description": "View past data in a chart and customize the appearance of the widgets by changing the background and text color",
            "whatsNew.v200.title": "Revamped UI",
            "whatsNew.v200.description": "Added new cards to show This Week usage, progress and plan progress. Also change the type of period for data plan either Range or Day",
            "whatsNew.v200.superTitle": "More Features on Super Pill Plan",
            "whatsNew.v200.insights": "Data Insights Card",
            "whatsNew.v200.shape": "Customize Pill Shape and Flow",
            "whatsNew.v200.widgets": "Customize Widgets",
            "whatsNew.v200.icon": "Customize App Icon and Accent",
            "whatsNew.v200.records": "View & Export All Data Records",
            "whatsNew.v130.title": "Data Unit",
            "whatsNew.v130.description": "You can now switch between GB or MB to view your data usage",
            "whatsNew.v120.title": "Adjustable Notification Threshold",
            "whatsNew.v120.untracked": "Untracked Data Amount",
            "whatsNew.v120.views": "New Views for This Week's Data",
            "whatsNew.v120.thresholds": "Adjustable Notification Thresholds",
            "whatsNew.v110.title": "Pill Customizations, Notifications"
        },
        de: {
            "footer.support": "Support",
            "footer.help": "Hilfe",
            "footer.whatsNew": "Neuigkeiten",
            "home.title": "Data Pill",
            "home.subtitle": "Überwache deine Datennutzung mühelos, egal wo du bist.",
            "home.plan.title": "Datentarif verwalten",
            "home.plan.description": "Passe deinen Datentarif an, setze Nutzungslimits und visualisiere deinen Verbrauch mit unserer einzigartigen pillenförmigen Leiste.",
            "home.flexible.title": "Flexible Optionen ohne Datentarif",
            "home.flexible.description": "Verfolge deine Daten mit täglichen Budgets, auch ohne klassischen Datentarif.",
            "home.widgets.title": "Überall und jederzeit im Blick",
            "home.widgets.description": "Bleib mit Widgets auf Home- und Sperrbildschirm auf einen Blick informiert.",
            "support.title": "Support",
            "support.card.title": "Brauchst du Hilfe?",
            "support.emailIntro": "Für Feedback oder Probleme kontaktiere uns per E-Mail:",
            "support.appSettings": "Du kannst in den App-Einstellungen auch 'Report a Bug' oder 'Request a Feature' öffnen.",
            "lang.en": "Englisch",
            "lang.de": "Deutsch",
            "lang.tr": "Türkisch",
            "lang.zh": "Chinesisch",
            "lang.fil": "Filipino",
            "help.title": "Hilfe",
            "help.meta": "Von PenguinWorksCo<br>Zuletzt aktualisiert: 24. Juli 2026",
            "help.guide.title": "Data Pill Anleitung",
            "help.guide.description": "Schnelle Antworten zum Einrichten deines Datentarifs, Lesen deiner Pill, Hinzufügen von Widgets und Sichern deiner Aufzeichnungen.",
            "help.topic.basics": "Grundlagen",
            "help.topic.streak": "Streak",
            "help.topic.pill": "Pill",
            "help.topic.widget": "Widget",
            "help.topic.notifications": "Mitteilungen",
            "help.topic.backup": "Backup",
            "help.topic.data": "Daten",
            "help.topic.languages": "Sprachen",
            "help.basics.dataPlan.q": "Was ist ein Datentarif?",
            "help.basics.dataPlan.a": "Ein Datentarif ist ein Dienst deines Mobilfunkanbieters, der mobilen Internetzugang gegen eine feste Gebühr bietet.",
            "help.basics.setPlan.q": "Wie richte ich den Datentarif ein?",
            "help.basics.setPlan.a": "Lege den Zeitraum und die Datenmenge deines Tarifs fest. Beides kannst du auf der Data Plan Karte bearbeiten.",
            "help.basics.disablePlan.q": "Wie deaktiviere ich den Datentarif?",
            "help.basics.disablePlan.a": "Du kannst den Datentarif mit dem Schalter deaktivieren, wenn du deine Nutzung nur täglich beobachten möchtest.",
            "help.basics.period.q": "Unterschied zwischen manuellem und automatischem Zeitraum?",
            "help.basics.period.auto": "<strong>Automatisch:</strong> Legt den nächsten Abrechnungszyklus oder Zeitraum automatisch fest.",
            "help.basics.period.manual": "<strong>Manuell:</strong> Du legst den Zeitraum selbst fest.",
            "help.basics.period.note": "<strong>Hinweis:</strong> Datumsangaben des Tarifzeitraums werden rot markiert, wenn das heutige Datum außerhalb des ausgewählten Zeitraums liegt.",
            "help.basics.dailyPlan.q": "Unterschied zwischen Tages- und Tarifnutzung?",
            "help.basics.dailyPlan.daily": "Tagesnutzung ist die Datenmenge, die innerhalb eines einzelnen Tages verbraucht wird.",
            "help.basics.dailyPlan.plan": "Tarifnutzung umfasst die gesamte Datennutzung innerhalb deines Mobilfunk-Abrechnungszyklus.",
            "help.basics.dataAmount.q": "Was ist die Datenmenge?",
            "help.basics.dataAmount.a": "Das ist die maximale Internetdatenmenge, die du in deinem Abrechnungszyklus nutzen kannst, ohne zusätzliche Kosten oder gedrosselte Geschwindigkeit.",
            "help.basics.untracked.q": "Was ist die nicht erfasste Menge?",
            "help.basics.untracked.a": "Das ist die Datennutzung aus deinem Mobilfunktarif, die vor der Installation von Data Pill entstanden ist. Diese Menge wird zur Gesamtnutzung des aktuellen Zeitraums addiert.",
            "help.basics.dailyLimit.q": "Was ist das Tageslimit?",
            "help.basics.dailyLimit.a": "Der tägliche Schwellenwert, ab dem die App dich per Mitteilung informiert, wenn du das Tageslimit überschritten hast.",
            "help.basics.planLimit.q": "Was ist das Tariflimit?",
            "help.basics.planLimit.a": "Ähnlich wie das Tageslimit, gilt aber für den gesamten Tarifzeitraum.",
            "help.streak.what.q": "Was ist ein Streak?",
            "help.streak.what.a1": "Ein Streak zählt, wie viele Tage in Folge du innerhalb deines täglichen Nutzungslimits geblieben bist. Wenn du dein Tageslimit nicht überschreitest, läuft dein Streak weiter.",
            "help.streak.what.a2": "Streaks benötigen ein gültiges Tageslimit. Wenn Data Plan aktiviert ist, muss der heutige Tag außerdem in deinem aktuellen Tarifzeitraum liegen.",
            "help.streak.rewards.q": "Wie funktionieren Streak Rewards?",
            "help.streak.rewards.a1": "Wenn du bestimmte Meilensteine erreichst, zum Beispiel 7, 14, 30 oder 60 Tage, kannst du eine Belohnung einlösen. Jede Belohnung schaltet Super Trial für 7 Tage frei, damit du die Premium-Funktionen von Data Pill testen kannst.",
            "help.streak.rewards.a2": "Wenn du eine weitere Belohnung einlöst, während Super Trial aktiv ist, verlängert die App deinen Testzeitraum.",
            "help.pill.what.q": "Was ist eine Pill?",
            "help.pill.what.a": "Eine Pill ist eine visuelle Anzeige für deine Tages- oder Tarifnutzung. Damit siehst du deinen Datenverbrauch schnell auf einen Blick.",
            "help.pill.week.q": "Wie zeige ich die Tagesnutzung der Woche?",
            "help.pill.week.a": "Tippe auf die Pill und wische dann nach links, um die Tagesnutzung der letzten 7 Tage zu sehen.",
            "help.pill.period.q": "Wie zeige ich alle Tage im aktuellen Zeitraum?",
            "help.pill.period.a": "Tippe auf die Pill und scrolle nach unten, um die vollständige Aufschlüsselung deiner Nutzung im aktuellen Abrechnungszeitraum zu sehen.",
            "help.widget.home.q": "Wie füge ich ein Widget zum Homescreen hinzu?",
            "help.widget.home.a": "Halte den Homescreen gedrückt und tippe oben rechts auf die Taste +. Suche nach dem Widget \"Data Pill\" und wähle die gewünschte Größe.",
            "help.widget.lock.q": "Wie füge ich ein Widget zum Lockscreen hinzu?",
            "help.widget.lock.a": "Halte den Lockscreen gedrückt und tippe auf \"Anpassen\". Tippe auf den unteren Widget-Bereich und füge das Widget \"Data Pill\" hinzu.",
            "help.widget.standby.q": "Wie füge ich Data Pill zu StandBy hinzu?",
            "help.widget.standby.a": "Halte den StandBy-Bildschirm gedrückt. Entsperre dein Telefon und tippe oben links auf die Taste +. Suche nach dem Widget \"Data Pill\", tippe auf \"Widget hinzufügen\" und dann auf \"Fertig\".",
            "help.widget.planUsage.q": "Warum sehe ich die Tarifnutzung nicht?",
            "help.widget.planUsage.a1": "Bearbeite das Widget auf dem Homescreen, indem du es lange gedrückt hältst. Stelle Usage Type auf Daily, um die heutige Nutzung zu sehen, oder auf Plan, um die Gesamtnutzung des aktuellen Zeitraums oder Zyklus zu sehen.",
            "help.widget.planUsage.a2": "Bei kleinen Widgets kannst du Small Widget außerdem auf Data Usage oder Days Left stellen. Du kannst auch ein weiteres Widget mit einer anderen Konfiguration hinzufügen, zum Beispiel Tage übrig im Zeitraum.",
            "help.widget.notUpdating.q": "Warum aktualisiert sich das Widget nicht?",
            "help.widget.notUpdating.a": "Widgets werden normalerweise alle 5 Minuten aktualisiert. Aktualisierungen können sich jedoch verzögern, wenn du die App nicht aktiv nutzt oder das tägliche Limit von 40-60 Aktualisierungen erreicht wurde.",
            "help.widget.blank.q": "Warum ist mein Widget leer oder schwarz?",
            "help.widget.blank.a": "Unter iOS 17 kann das Widget nach einem App-Update schwarz werden. Das ist ein iOS-Problem. Starte dein Gerät neu oder entferne das Widget vom Homescreen und füge es erneut hinzu.",
            "help.notifications.notWorking.q": "Warum funktionieren Mitteilungen nicht?",
            "help.notifications.notWorking.a": "Stelle sicher, dass Mitteilungen an beiden Stellen aktiviert sind:",
            "help.notifications.device": "Geräteeinstellungen:",
            "help.notifications.app": "App-Einstellungen:",
            "help.path.deviceNotifications": "Settings > Data Pill > Notifications > Allow Notifications",
            "help.path.appNotifications": "Settings > Notifications > Daily Usage & Plan Usage",
            "help.backup.how.q": "Wie sichere und stelle ich meine Aufzeichnungen wieder her?",
            "help.backup.how.a1": "Aktiviere zum Sichern deiner Daten das Backup für \"Data Pill\" in den Einstellungen.",
            "help.path.icloud": "Settings > [Your Name] > [This Device] > iCloud Backup > [This Device Backup] > Enable \"Data Pill\"",
            "help.backup.how.a2": "Mit Super Pill kannst du deine Daten auch manuell sichern, indem du sie aus Records als <strong>CSV-Datei</strong> exportierst.",
            "help.path.exportCsv": "Settings > Show All Records > Export to CSV",
            "help.backup.csv.intro": "Beim Wiederherstellen aus einer CSV-Datei sind die ersten beiden Spalten erforderlich. Zusätzliche Spalten aus Data Pill Exporten werden akzeptiert und beim Import ignoriert.",
            "help.backup.csv.columns": "Erforderliche Spalten: <strong>Date</strong> und <strong>Used Amount in MB</strong>.",
            "help.backup.csv.date": "Das Datumsformat sollte d MMM yyyy sein. Monatsnamen können auf Deutsch, Türkisch, Chinesisch, Filipino oder Englisch sein.",
            "help.backup.csv.amount": "Used Amount in MB muss eine gültige Zahl sein.",
            "help.backup.csv.structure": "Behalte die Dateistruktur genau bei, damit der Import reibungslos funktioniert.",
            "help.data.accuracy.q": "Warum ist die Nutzung in der App nicht genau?",
            "help.data.accuracy.a": "Aufgrund von API-Einschränkungen kann es eine Abweichung von +/- 1-5 MB geben. Prüfe die Telefoneinstellungen für die exakte Datennutzung.",
            "help.data.speed.q": "Wie berechnet die App die Geschwindigkeit?",
            "help.data.speed.a1": "Wenn \"Tracking Data Amount Throughout the Day\" in den Einstellungen aktiviert ist, versucht die App, die genutzte Datenmenge alle 5 Minuten oder nach dem gewählten Intervall zu erfassen. Diese Erfassung ist jedoch nicht immer genau, da Widget-Aktualisierungen vom Aktualisierungsplan des Systems abhängen. Wenn einige Intervalle fehlen, bildet die App den Durchschnitt der verfügbaren Daten.",
            "help.path.dataUpdates": "设置 > 数据更新 > 全天追踪数据用量",
            "help.data.speed.a2": "Wenn du zum Beispiel in den letzten 3 Intervallen 0,1 MB genutzt hast, berechnet die App den Durchschnitt als 0,1 MB / 3 = 0,033 MB. Alle nicht kumulativen Datenpunkte des Tages werden gemittelt und als Geschwindigkeit angezeigt, zum Beispiel x MB / 5 min.",
            "help.data.track.q": "Warum wird meine Datennutzung nicht erfasst?",
            "help.data.track.a1": "Damit deine Datennutzung erfasst wird, während die App nicht geöffnet ist, musst du das Widget zum Home- oder Sperrbildschirm hinzufügen.",
            "help.data.track.a2": "Für die Erfassung über den Tag und Geschwindigkeitsstatistiken benötigst du außerdem Super Pill und die aktivierte Data Updates Tracking-Einstellung.",
            "help.data.track.a3": "Das Widget aktualisiert deine Datennutzung nur, wenn es vom System aktualisiert wird. Wenn das Widget nicht hinzugefügt wurde oder noch nicht aktualisiert wurde, werden die Daten nicht aktualisiert.",
            "help.languages.title": "Unterstützte Sprachen",
            "help.languages.change": "So änderst du die App-Sprache:",
            "help.path.language": "Device Settings > Apps > Data Pill > Language > Select Language",
            "whatsNew.title": "Neuigkeiten",
            "whatsNew.v290.title": "Streaks, Rewards und dynamische Themes",
            "whatsNew.v290.streaks": "<strong>Tägliche Streaks:</strong><br/>Bleib im sicheren Bereich und baue einen Streak auf, während du deinen Datentarif Tag für Tag verwaltest.",
            "whatsNew.v290.rewards": "<strong>Streak Rewards:</strong><br/>Erreiche Streak-Meilensteine, um Super Pill Testtage freizuschalten und deinen Fortschritt weiterzuführen.",
            "whatsNew.v290.daysLeft": "<strong>Tage übrig:</strong><br/>Sieh direkt in der App und auf deinen Widgets, wie viele Tage in deinem Tarif noch übrig sind.",
            "whatsNew.v290.themes": "<strong>Dynamische Themes:</strong><br/>Wähle System, Dunkel oder Hell, mit verbesserten Widget-Farben, die sich deinem Look anpassen.",
            "whatsNew.v290.homeWidgets": "<strong>Smartere Startseite und Widgets:</strong><br/>Streaks, Datenstatus, verbleibende Tage und Super Pill Abo-Details sind schneller auf einen Blick sichtbar.",
            "whatsNew.v270.title": "Startanleitung und Datenimport",
            "whatsNew.v270.guide": "<strong>Neue Startanleitung:</strong><br/>Starte schnell mit unserer neuen Schritt-für-Schritt-Anleitung.",
            "whatsNew.v270.import": "<strong>Daten importieren:</strong><br/>Importiere deine bestehenden Daten einfach mit CSV-Dateien.",
            "whatsNew.v250.title": "Visualisiere deine Daten alle paar Minuten",
            "whatsNew.v250.description": "Du kannst jetzt die Erfassung aktivieren, um zu sehen, wie viele Daten du alle X Minuten genutzt hast. Beobachte deinen Nutzungsverlauf mit unserem neuen Liniendiagramm, damit du die Kontrolle behältst und Überraschungen vermeidest.",
            "whatsNew.v240.title": "Eigene Partikel und neue Pill-Formen",
            "whatsNew.v240.description": "Werde kreativ mit unserer neuen interaktiven Pill-Funktion!",
            "whatsNew.v240.particles": "<strong>Animierte Partikel:</strong><br/>Füge Partikel hinzu, die sich in deinen Pills nach oben, unten oder in jede Richtung bewegen.",
            "whatsNew.v240.control": "<strong>Volle Kontrolle:</strong><br/>Passe Partikelform, Geschwindigkeit, Deckkraft und mehr an.",
            "whatsNew.v240.options": "<strong>Mehr Pill-Optionen:</strong><br/>Wähle von einfachen Formen bis zu lustigen Emoji-Pills.",
            "whatsNew.v230.title": "App-Warnungen und Tipps",
            "whatsNew.v230.description": "Wir haben intelligente Warnungen und hilfreiche Tipps hinzugefügt, damit du deine Datennutzung im Griff behältst!",
            "whatsNew.v230.alerts": "<strong>Echtzeit-Warnungen:</strong><br/>Erhalte eine Mitteilung, wenn du dein mobiles Datenlimit erreichst oder überschreitest - direkt in der App.",
            "whatsNew.v230.tips": "<strong>Smarte Tipps zum Datensparen:</strong><br/>Entdecke einfache, praktische Wege, um die Datennutzung zu reduzieren und Mehrkosten zu vermeiden.",
            "whatsNew.v220.title": "Mehr Widgets auf Sperrbildschirm und Homescreen",
            "whatsNew.v220.description": "Sieh deine Wochennutzung auf dem Homescreen und schaffe mit dem neuen kompakten Widget mehr Platz für andere Widgets auf dem Sperrbildschirm.",
            "whatsNew.v210.title": "Aufzeichnungsverlauf und Widget-Anpassung",
            "whatsNew.v210.description": "Sieh frühere Daten in einem Diagramm und passe das Aussehen der Widgets an, indem du Hintergrund- und Textfarbe änderst.",
            "whatsNew.v200.title": "Überarbeitete UI",
            "whatsNew.v200.description": "Neue Karten zeigen die Nutzung dieser Woche, den Fortschritt und den Tariffortschritt. Außerdem kannst du den Zeitraumtyp für den Datentarif als Range oder Day wählen.",
            "whatsNew.v200.superTitle": "Mehr Funktionen im Super Pill Plan",
            "whatsNew.v200.insights": "Karte für Daten-Insights",
            "whatsNew.v200.shape": "Pill-Form und Flow anpassen",
            "whatsNew.v200.widgets": "Widgets anpassen",
            "whatsNew.v200.icon": "App-Icon und Akzent anpassen",
            "whatsNew.v200.records": "Alle Datensätze anzeigen und exportieren",
            "whatsNew.v130.title": "Dateneinheit",
            "whatsNew.v130.description": "Du kannst jetzt zwischen GB und MB wechseln, um deine Datennutzung anzuzeigen.",
            "whatsNew.v120.title": "Anpassbarer Mitteilungsschwellenwert",
            "whatsNew.v120.untracked": "Nicht erfasste Datenmenge",
            "whatsNew.v120.views": "Neue Ansichten für die Daten dieser Woche",
            "whatsNew.v120.thresholds": "Anpassbare Mitteilungsschwellenwerte",
            "whatsNew.v110.title": "Pill-Anpassungen, Mitteilungen"
        },
        "zh-Hans": {
            "footer.support": "支持",
            "footer.help": "帮助",
            "footer.whatsNew": "新功能",
            "home.title": "Data Pill",
            "home.subtitle": "无论身在何处，都能轻松监控数据用量。",
            "home.plan.title": "流量套餐管理",
            "home.plan.description": "自定义你的流量套餐、设置用量限制，并用独特的 Pill 形进度条可视化数据消耗。",
            "home.flexible.title": "无传统套餐也可灵活使用",
            "home.flexible.description": "即使没有传统流量套餐，也可以通过每日预算追踪数据用量。",
            "home.widgets.title": "随时随地监控",
            "home.widgets.description": "通过主屏幕和锁定屏幕小组件，一眼掌握最新状态。",
            "support.title": "支持",
            "support.card.title": "需要帮助？",
            "support.emailIntro": "如果有任何反馈或遇到问题，请通过电子邮件联系我们：",
            "support.appSettings": "你也可以在 App 设置中打开“Report a Bug”或“Request a Feature”。",
            "lang.en": "英语",
            "lang.de": "德语",
            "lang.tr": "土耳其语",
            "lang.zh": "中文",
            "lang.fil": "菲律宾语",
            "help.title": "帮助",
            "help.meta": "由 PenguinWorksCo 发布<br>最后更新：2026 年 7 月 24 日",
            "help.guide.title": "Data Pill 指南",
            "help.guide.description": "快速了解如何设置流量套餐、查看 Pill、添加小组件，以及备份你的记录。",
            "help.topic.basics": "基础",
            "help.topic.streak": "连续天数",
            "help.topic.pill": "Pill",
            "help.topic.widget": "小组件",
            "help.topic.notifications": "通知",
            "help.topic.backup": "备份",
            "help.topic.data": "数据",
            "help.topic.languages": "语言",
            "help.basics.dataPlan.q": "什么是流量套餐？",
            "help.basics.dataPlan.a": "流量套餐是移动运营商提供的服务，用户支付固定费用后，可以在移动设备上使用互联网。",
            "help.basics.setPlan.q": "如何设置流量套餐？",
            "help.basics.setPlan.a": "你需要设置套餐周期和套餐流量。两项都可以在 Data Plan 卡片中编辑。",
            "help.basics.disablePlan.q": "如何停用流量套餐？",
            "help.basics.disablePlan.a": "如果你只想按天监控流量，可以使用开关停用流量套餐。",
            "help.basics.period.q": "手动周期和自动周期有什么区别？",
            "help.basics.period.auto": "<strong>自动：</strong>自动设置下一个账单周期或套餐周期。",
            "help.basics.period.manual": "<strong>手动：</strong>由你自己设置周期。",
            "help.basics.period.note": "<strong>注意：</strong>如果今天不在所选周期范围内，套餐周期日期会以红色显示。",
            "help.basics.dailyPlan.q": "每日用量和套餐用量有什么区别？",
            "help.basics.dailyPlan.daily": "每日用量是指单日内消耗的数据量。",
            "help.basics.dailyPlan.plan": "套餐用量是指你的移动运营商账单周期内的总数据用量。",
            "help.basics.dataAmount.q": "什么是数据量？",
            "help.basics.dataAmount.a": "这是你在账单周期内可使用的最大互联网数据量，超过后可能产生额外费用或被限速。",
            "help.basics.untracked.q": "什么是未追踪用量？",
            "help.basics.untracked.a": "这是安装 Data Pill 之前已经产生的移动数据用量。该数值会计入当前周期的总用量。",
            "help.basics.dailyLimit.q": "什么是每日限制？",
            "help.basics.dailyLimit.a": "这是 App 设置的每日阈值。如果你超过每日限制，App 会通过通知提醒你。",
            "help.basics.planLimit.q": "什么是套餐限制？",
            "help.basics.planLimit.a": "类似每日限制，但适用于整个套餐周期。",
            "help.streak.what.q": "什么是连续天数？",
            "help.streak.what.a1": "连续天数会记录你连续多少天没有超过每日用量限制。只要当天没有超出每日限制，连续天数就会继续累计。",
            "help.streak.what.a2": "连续天数需要有效的每日限制。如果启用了 Data Plan，今天还必须在当前套餐周期内。",
            "help.streak.rewards.q": "Streak Rewards 如何运作？",
            "help.streak.rewards.a1": "当你达到 7、14、30 或 60 天等里程碑时，可以领取奖励。每个奖励都会解锁 7 天 Super Trial，让你体验 Data Pill 的高级功能。",
            "help.streak.rewards.a2": "如果你在 Super Trial 生效期间领取新的奖励，App 会延长你的试用时间。",
            "help.pill.what.q": "什么是 Pill？",
            "help.pill.what.a": "Pill 是每日用量或套餐用量的视觉指示器，让你快速查看数据消耗情况。",
            "help.pill.week.q": "如何查看本周每日用量？",
            "help.pill.week.a": "点击 Pill，然后向左滑动，即可查看过去 7 天的每日用量。",
            "help.pill.period.q": "如何查看当前周期内所有每日用量？",
            "help.pill.period.a": "点击 Pill，然后向下滚动，即可查看当前账单周期内的完整用量明细。",
            "help.widget.home.q": "如何将小组件添加到主屏幕？",
            "help.widget.home.a": "在主屏幕长按空白区域，然后点击右上角的 + 按钮。搜索 \"Data Pill\" 小组件，并选择你想要的尺寸。",
            "help.widget.lock.q": "如何将小组件添加到锁定屏幕？",
            "help.widget.lock.a": "长按锁定屏幕，然后点击“自定义”。点击底部小组件区域，并添加 \"Data Pill\" 小组件。",
            "help.widget.standby.q": "如何添加到 StandBy？",
            "help.widget.standby.a": "在 StandBy 显示时长按屏幕。解锁手机后点击左上角的 + 按钮。搜索 \"Data Pill\" 小组件，点击“添加小组件”，然后点击“完成”。",
            "help.widget.planUsage.q": "为什么看不到套餐用量？",
            "help.widget.planUsage.a1": "你需要在主屏幕长按小组件来编辑它。将 Usage Type 设置为 Daily 可查看今天的用量，设置为 Plan 可查看当前周期或账单周期的总用量。",
            "help.widget.planUsage.a2": "对于小组件，你也可以将 Small Widget 改为 Data Usage 或 Days Left。你还可以添加另一个不同配置的小组件，例如显示周期剩余天数。",
            "help.widget.notUpdating.q": "为什么小组件没有更新？",
            "help.widget.notUpdating.a": "小组件通常每 5 分钟更新一次。不过，如果你没有主动使用 App，或已达到每天 40-60 次刷新的系统限制，更新可能会延迟。",
            "help.widget.blank.q": "为什么我的小组件是空白或黑色？",
            "help.widget.blank.a": "在 iOS 17 上，更新 App 后小组件可能会变黑。这是 iOS 问题。请重启设备，或从主屏幕移除小组件后重新添加。",
            "help.notifications.notWorking.q": "为什么通知不工作？",
            "help.notifications.notWorking.a": "请确认以下两个位置都已启用通知：",
            "help.notifications.device": "设备设置：",
            "help.notifications.app": "App 设置：",
            "help.path.deviceNotifications": "Settings > Data Pill > Notifications > Allow Notifications",
            "help.path.appNotifications": "Settings > Notifications > Daily Usage & Plan Usage",
            "help.backup.how.q": "如何备份和恢复我的记录？",
            "help.backup.how.a1": "若要备份数据，请在设置中启用 \"Data Pill\" 备份。",
            "help.path.icloud": "Settings > [Your Name] > [This Device] > iCloud Backup > [This Device Backup] > Enable \"Data Pill\"",
            "help.backup.how.a2": "使用 Super Pill 时，你也可以从 Records 手动导出为 <strong>CSV 文件</strong> 来备份数据。",
            "help.path.exportCsv": "Settings > Show All Records > Export to CSV",
            "help.backup.csv.intro": "从 CSV 文件恢复时，前两列是必需的。Data Pill 导出的额外列会被接受，并在导入时忽略。",
            "help.backup.csv.columns": "必需列：<strong>Date</strong> 和 <strong>Used Amount in MB</strong>。",
            "help.backup.csv.date": "日期格式应为 d MMM yyyy。月份名称可以是德语、土耳其语、中文、菲律宾语或英语。",
            "help.backup.csv.amount": "Used Amount in MB 必须是有效数字。",
            "help.backup.csv.structure": "请保持文件结构完全相同，以便顺利导入。",
            "help.data.accuracy.q": "为什么 App 中的用量不准确？",
            "help.data.accuracy.a": "由于 API 限制，可能会有 +/- 1-5 MB 的差异。请查看手机设置以获取精确的数据用量。",
            "help.data.speed.q": "App 如何计算速度？",
            "help.data.speed.a1": "启用设置中的 \"Tracking Data Amount Throughout the Day\" 后，App 会尝试每 5 分钟或按所选时间间隔记录一次数据用量。不过，由于小组件更新取决于系统刷新安排，追踪并不总是精确。如果部分间隔缺失，App 会对可用数据取平均值。",
            "help.path.dataUpdates": "Ayarlar > Veri Güncellemeleri > Gün Boyunca Veri Miktarını Takip Et",
            "help.data.speed.a2": "例如，如果你在最近 3 个间隔中使用了 0.1 MB，App 会计算平均值：0.1 MB / 3 = 0.033 MB。当天收集的所有非累计数据点都会被平均，并显示为速度，例如 x MB / 5 min。",
            "help.data.track.q": "为什么没有追踪我的数据用量？",
            "help.data.track.a1": "如果想在 App 未打开时追踪数据用量，你需要将小组件添加到主屏幕或锁定屏幕。",
            "help.data.track.a2": "若要追踪全天数据并查看速度统计，你还需要 Super Pill，并启用 Data Updates 追踪设置。",
            "help.data.track.a3": "只有当系统刷新小组件时，小组件才会更新你的数据用量。如果没有添加小组件，或小组件尚未刷新，数据就不会更新。",
            "help.languages.title": "支持的语言",
            "help.languages.change": "若要更改 App 语言，请前往：",
            "help.path.language": "Device Settings > Apps > Data Pill > Language > Select Language",
            "whatsNew.title": "新功能",
            "whatsNew.v290.title": "连续天数、奖励和动态主题",
            "whatsNew.v290.streaks": "<strong>每日连续天数：</strong><br/>在每天管理流量套餐时保持在安全范围内，并建立连续天数。",
            "whatsNew.v290.rewards": "<strong>Streak Rewards：</strong><br/>达到连续天数里程碑即可解锁 Super Pill 试用天数，让你的进度继续前进。",
            "whatsNew.v290.daysLeft": "<strong>剩余天数：</strong><br/>直接在 App 和小组件中查看套餐还剩多少天。",
            "whatsNew.v290.themes": "<strong>动态主题：</strong><br/>选择系统、深色或浅色模式，并使用会适应外观的改进小组件颜色。",
            "whatsNew.v290.homeWidgets": "<strong>更智能的首页和小组件：</strong><br/>连续天数、数据状态、剩余天数和 Super Pill 订阅详情都更容易一眼查看。",
            "whatsNew.v270.title": "启动指南和导入数据",
            "whatsNew.v270.guide": "<strong>全新启动指南：</strong><br/>通过新的分步指南快速上手。",
            "whatsNew.v270.import": "<strong>导入数据：</strong><br/>使用 CSV 文件轻松导入现有数据。",
            "whatsNew.v250.title": "每隔几分钟可视化你的数据",
            "whatsNew.v250.description": "现在可以启用追踪，查看每 X 分钟使用了多少数据。通过新的折线图查看数据用量趋势，保持掌控并避免意外。",
            "whatsNew.v240.title": "自定义粒子和新的 Pill 形状",
            "whatsNew.v240.description": "使用新的互动 Pill 功能发挥创意！",
            "whatsNew.v240.particles": "<strong>动画粒子：</strong><br/>添加可在 Pill 内向上、向下或任意方向移动的粒子。",
            "whatsNew.v240.control": "<strong>完全控制：</strong><br/>自定义粒子形状、速度、透明度等。",
            "whatsNew.v240.options": "<strong>更多 Pill 选项：</strong><br/>从基础形状到有趣的表情 Pill 都可选择。",
            "whatsNew.v230.title": "App 提醒和提示",
            "whatsNew.v230.description": "我们加入了智能提醒和实用提示，帮助你掌控数据用量！",
            "whatsNew.v230.alerts": "<strong>实时提醒：</strong><br/>当你达到或超过移动数据限制时，会直接在 App 内收到通知。",
            "whatsNew.v230.tips": "<strong>智能省流提示：</strong><br/>发现简单实用的方法，减少数据用量并避免超额。",
            "whatsNew.v220.title": "锁定屏幕和主屏幕上的更多小组件",
            "whatsNew.v220.description": "在主屏幕查看每周用量，并通过新的紧凑小组件为锁定屏幕腾出更多空间。",
            "whatsNew.v210.title": "记录历史和小组件自定义",
            "whatsNew.v210.description": "在图表中查看过去数据，并通过更改背景和文字颜色来自定义小组件外观。",
            "whatsNew.v200.title": "全新 UI",
            "whatsNew.v200.description": "新增卡片显示本周用量、进度和套餐进度。还可以将流量套餐周期类型更改为 Range 或 Day。",
            "whatsNew.v200.superTitle": "Super Pill Plan 的更多功能",
            "whatsNew.v200.insights": "数据洞察卡片",
            "whatsNew.v200.shape": "自定义 Pill 形状和流动效果",
            "whatsNew.v200.widgets": "自定义小组件",
            "whatsNew.v200.icon": "自定义 App 图标和强调色",
            "whatsNew.v200.records": "查看并导出所有数据记录",
            "whatsNew.v130.title": "数据单位",
            "whatsNew.v130.description": "现在可以在 GB 和 MB 之间切换来查看数据用量。",
            "whatsNew.v120.title": "可调整通知阈值",
            "whatsNew.v120.untracked": "未追踪数据量",
            "whatsNew.v120.views": "本周数据的新视图",
            "whatsNew.v120.thresholds": "可调整通知阈值",
            "whatsNew.v110.title": "Pill 自定义和通知"
        },
        tr: {
            "footer.support": "Destek",
            "footer.help": "Yardım",
            "footer.whatsNew": "Yenilikler",
            "home.title": "Data Pill",
            "home.subtitle": "Nerede olursan ol veri kullanımını zahmetsizce takip et.",
            "home.plan.title": "Veri Planı Yönetimi",
            "home.plan.description": "Veri planını düzenle, kullanım limitleri belirle ve benzersiz pill şeklindeki çubuğumuzla veri tüketimini görselleştir.",
            "home.flexible.title": "Veri Planı Olmadan Esnek Seçenekler",
            "home.flexible.description": "Geleneksel bir veri planın olmasa bile günlük bütçelerle verini takip et.",
            "home.widgets.title": "Her Yerde, Her Zaman Takip",
            "home.widgets.description": "Ana ekran ve kilit ekranı widget'larıyla durumu tek bakışta gör.",
            "support.title": "Destek",
            "support.card.title": "Yardıma mı ihtiyacın var?",
            "support.emailIntro": "Geri bildirim veya karşılaştığın sorunlar için bize e-posta ile ulaş:",
            "support.appSettings": "Uygulama ayarlarında 'Report a Bug' veya 'Request a Feature' bölümüne de gidebilirsin.",
            "lang.en": "İngilizce",
            "lang.de": "Almanca",
            "lang.tr": "Türkçe",
            "lang.zh": "Çince",
            "lang.fil": "Filipince",
            "help.title": "Yardım",
            "help.meta": "PenguinWorksCo tarafından<br>Son Güncelleme: 24 Tem 2026",
            "help.guide.title": "Data Pill Rehberi",
            "help.guide.description": "Veri planını ayarlama, Pill'i okuma, widget ekleme ve kayıtlarını yedekleme hakkında hızlı yanıtlar.",
            "help.topic.basics": "Temel Bilgiler",
            "help.topic.streak": "Streak",
            "help.topic.pill": "Pill",
            "help.topic.widget": "Widget",
            "help.topic.notifications": "Bildirimler",
            "help.topic.backup": "Yedekleme",
            "help.topic.data": "Veri",
            "help.topic.languages": "Diller",
            "help.basics.dataPlan.q": "Veri Planı nedir?",
            "help.basics.dataPlan.a": "Veri planı, mobil operatörlerin sabit bir ücret karşılığında mobil cihazlarda internet erişimi sunan hizmetidir.",
            "help.basics.setPlan.q": "Veri Planı nasıl ayarlanır?",
            "help.basics.setPlan.a": "Planının dönemini ve veri miktarını ayarlaman gerekir. Bunların tümü Data Plan kartından düzenlenebilir.",
            "help.basics.disablePlan.q": "Veri Planı nasıl devre dışı bırakılır?",
            "help.basics.disablePlan.a": "Veriyi yalnızca günlük olarak izlemek istiyorsan veri planını anahtarla devre dışı bırakabilirsin.",
            "help.basics.period.q": "Manuel ve Otomatik Dönem arasındaki fark nedir?",
            "help.basics.period.auto": "<strong>Otomatik:</strong> Sonraki fatura döngüsünü veya dönemi otomatik olarak ayarlar.",
            "help.basics.period.manual": "<strong>Manuel:</strong> Dönemi kendin ayarlarsın.",
            "help.basics.period.note": "<strong>Not:</strong> Bugünün tarihi seçilen dönem aralığında değilse Plan Period tarihleri kırmızı vurgulanır.",
            "help.basics.dailyPlan.q": "Günlük ve Plan Kullanımı arasındaki fark nedir?",
            "help.basics.dailyPlan.daily": "Günlük kullanım, tek bir gün içinde tüketilen veri miktarıdır.",
            "help.basics.dailyPlan.plan": "Plan kullanımı, mobil operatör fatura döngündeki toplam veri kullanımını kapsar.",
            "help.basics.dataAmount.q": "Veri Miktarı nedir?",
            "help.basics.dataAmount.a": "Fatura döngünde ek ücret veya hız düşümü yaşamadan kullanabileceğin en yüksek internet veri miktarıdır.",
            "help.basics.untracked.q": "Takip Edilmeyen Miktar nedir?",
            "help.basics.untracked.a": "Data Pill'i yüklemeden önce mobil internet planında oluşan veri kullanımıdır. Bu ek miktar, mevcut dönem toplam kullanımına dahil edilir.",
            "help.basics.dailyLimit.q": "Günlük Limit nedir?",
            "help.basics.dailyLimit.a": "Günlük limiti aştığında uygulamanın bildirim göndermesi için ayarlanan günlük eşiktir.",
            "help.basics.planLimit.q": "Plan Limiti nedir?",
            "help.basics.planLimit.a": "Günlük Limit'e benzer, ancak tüm plan dönemi için geçerlidir.",
            "help.streak.what.q": "Streak nedir?",
            "help.streak.what.a1": "Streak, günlük kullanım limitinin içinde kaldığın ardışık gün sayısını takip eder. Günlük limitini aşmadığın her gün streak devam eder.",
            "help.streak.what.a2": "Streak için geçerli bir Günlük Limit gerekir. Data Plan açıksa, bugünün mevcut plan dönemi içinde olması da gerekir.",
            "help.streak.rewards.q": "Streak Rewards nasıl çalışır?",
            "help.streak.rewards.a1": "7, 14, 30 veya 60 gün gibi belirli kilometre taşlarına ulaştığında ödül alabilirsin. Her ödül, Data Pill'in premium özelliklerini deneyebilmen için Super Trial'ı 7 gün açar.",
            "help.streak.rewards.a2": "Super Trial aktifken başka bir ödül alırsan uygulama deneme süreni uzatır.",
            "help.pill.what.q": "Pill nedir?",
            "help.pill.what.a": "Pill, günlük veya plan kullanımını gösteren görsel bir göstergedir. Veri tüketimini hızlıca görmeni sağlar.",
            "help.pill.week.q": "Haftanın Günlük Kullanımı nasıl gösterilir?",
            "help.pill.week.a": "Pill'e dokun, ardından son 7 günün günlük kullanımını görmek için sola kaydır.",
            "help.pill.period.q": "Mevcut Dönemin tüm Günlük Kullanımı nasıl gösterilir?",
            "help.pill.period.a": "Pill'e dokun, ardından mevcut fatura dönemindeki kullanımının tam dökümünü görmek için aşağı kaydır.",
            "help.widget.home.q": "Homescreen'e widget nasıl eklenir?",
            "help.widget.home.a": "Homescreen'e widget eklemek için ana ekrana uzun bas, sonra ekranın sağ üstündeki + düğmesine dokun. \"Data Pill\" widget'ını ara ve istediğin boyutu seç.",
            "help.widget.lock.q": "Lockscreen'e widget nasıl eklenir?",
            "help.widget.lock.a": "Lockscreen'e uzun bas, sonra \"Customize\" seçeneğine dokun. Alt widget alanına dokun ve \"Data Pill\" widget'ını ekle.",
            "help.widget.standby.q": "StandBy'a nasıl eklenir?",
            "help.widget.standby.a": "StandBy ekranındayken ekrana uzun bas. Telefonunun kilidini aç, sonra sol üstteki + düğmesine dokun. \"Data Pill\" widget'ını ara, \"Add Widget\" düğmesine ve ardından \"Done\" düğmesine dokun.",
            "help.widget.planUsage.q": "Plan Kullanımını neden göremiyorum?",
            "help.widget.planUsage.a1": "Homescreen'de widget'a uzun basarak widget'ı düzenlemen gerekir. Bugünkü kullanımı görmek için Usage Type değerini Daily, mevcut dönem veya döngüdeki toplam kullanımı görmek için Plan yap.",
            "help.widget.planUsage.a2": "Küçük widget'larda Small Widget değerini Data Usage veya Days Left olarak da değiştirebilirsin. Dönemde kalan günler gibi farklı yapılandırmaya sahip başka bir widget da ekleyebilirsin.",
            "help.widget.notUpdating.q": "Widget neden güncellenmiyor?",
            "help.widget.notUpdating.a": "Widget'lar genellikle her 5 dakikada bir güncellenir. Ancak uygulamayı aktif kullanmıyorsan veya günlük 40-60 yenileme sınırına ulaştıysan güncellemeler gecikebilir.",
            "help.widget.blank.q": "Widget'ım neden boş veya siyah?",
            "help.widget.blank.a": "iOS 17'de uygulamayı güncelledikten sonra widget siyah görünebilir. Bu bir iOS sorunudur. Düzeltmek için cihazını yeniden başlat veya widget'ı homescreen'den kaldırıp tekrar ekle.",
            "help.notifications.notWorking.q": "Bildirimler neden çalışmıyor?",
            "help.notifications.notWorking.a": "Bildirimlerin iki yerde de açık olduğundan emin ol:",
            "help.notifications.device": "Cihaz Ayarları:",
            "help.notifications.app": "Uygulama Ayarları:",
            "help.path.deviceNotifications": "Settings > Data Pill > Notifications > Allow Notifications",
            "help.path.appNotifications": "Settings > Notifications > Daily Usage & Plan Usage",
            "help.backup.how.q": "Kayıtlarımı nasıl yedekler ve geri yüklerim?",
            "help.backup.how.a1": "Verilerini yedeklemek için Ayarlar'da \"Data Pill\" yedeklemesini etkinleştir.",
            "help.path.icloud": "Settings > [Your Name] > [This Device] > iCloud Backup > [This Device Backup] > Enable \"Data Pill\"",
            "help.backup.how.a2": "Super Pill ile verilerini Records bölümünden <strong>CSV dosyası</strong> olarak dışa aktararak da manuel yedekleyebilirsin.",
            "help.path.exportCsv": "Settings > Show All Records > Export to CSV",
            "help.backup.csv.intro": "CSV dosyasından geri yüklerken ilk iki sütun gereklidir. Data Pill dışa aktarımlarındaki ek sütunlar kabul edilir ve içe aktarma sırasında yok sayılır.",
            "help.backup.csv.columns": "Gerekli sütunlar: <strong>Date</strong> ve <strong>Used Amount in MB</strong>.",
            "help.backup.csv.date": "Tarih biçimi d MMM yyyy olmalıdır. Ay adları Almanca, Türkçe, Çince, Filipince veya İngilizce olabilir.",
            "help.backup.csv.amount": "Used Amount in MB geçerli bir sayı olmalıdır.",
            "help.backup.csv.structure": "Sorunsuz içe aktarma için dosya yapısını tamamen aynı tut.",
            "help.data.accuracy.q": "Uygulamadaki Kullanım neden doğru değil?",
            "help.data.accuracy.a": "API sınırlamaları nedeniyle +/- 1-5 MB fark olabilir. Kesin veri kullanımı için telefonunun ayarlarını kontrol et.",
            "help.data.speed.q": "Uygulama hızı nasıl hesaplar?",
            "help.data.speed.a1": "Ayarlar'da \"Tracking Data Amount Throughout the Day\" açık olduğunda uygulama, kullanılan veri miktarını her 5 dakikada bir veya seçilen zaman aralığına göre kaydetmeye çalışır. Ancak widget güncellemeleri sistemin yenileme zamanlamasına bağlı olduğu için bu takip her zaman kesin değildir. Bazı aralıklar kaçırılırsa uygulama eldeki verilerin ortalamasını alır.",
            "help.path.dataUpdates": "Settings > Data Updates > I-track ang Data Amount sa Buong Araw",
            "help.data.speed.a2": "Örneğin son 3 aralıkta 0,1 MB kullandıysan uygulama ortalamayı 0,1 MB / 3 = 0,033 MB olarak hesaplar. Gün boyunca toplanan tüm kümülatif olmayan veri noktaları ortalanır ve x MB / 5 min gibi hız olarak gösterilir.",
            "help.data.track.q": "Veri kullanımım neden takip edilmiyor?",
            "help.data.track.a1": "Uygulama açık değilken veri kullanımını takip etmek için widget'ı ana ekrana veya kilit ekranına eklemen gerekir.",
            "help.data.track.a2": "Gün boyu takip ve hız istatistikleri için ayrıca Super Pill'e ve Data Updates takip ayarının açık olmasına ihtiyacın vardır.",
            "help.data.track.a3": "Widget, verini yalnızca sistem tarafından yenilendiğinde günceller. Widget eklenmemişse veya henüz yenilenmemişse veri güncellenmez.",
            "help.languages.title": "Desteklenen Diller",
            "help.languages.change": "Uygulama dilini değiştirmek için şuraya git:",
            "help.path.language": "Device Settings > Apps > Data Pill > Language > Select Language",
            "whatsNew.title": "Yenilikler",
            "whatsNew.v290.title": "Streaks, Ödüller ve Dinamik Temalar",
            "whatsNew.v290.streaks": "<strong>Günlük Streaks:</strong><br/>Veri planını gün gün yönetirken güvenli bölgede kal ve streak oluştur.",
            "whatsNew.v290.rewards": "<strong>Streak Rewards:</strong><br/>Super Pill deneme günlerini açmak ve ilerlemeyi sürdürmek için streak kilometre taşlarına ulaş.",
            "whatsNew.v290.daysLeft": "<strong>Kalan Günler:</strong><br/>Planında kaç gün kaldığını doğrudan uygulamada ve widget'larında gör.",
            "whatsNew.v290.themes": "<strong>Dinamik Temalar:</strong><br/>Sistem, Koyu veya Açık modu seç; görünümüne uyum sağlayan geliştirilmiş widget renklerini kullan.",
            "whatsNew.v290.homeWidgets": "<strong>Daha akıllı Ana Ekran ve Widget'lar:</strong><br/>Streaks, veri durumu, kalan günler ve Super Pill abonelik ayrıntılarını tek bakışta daha kolay kontrol et.",
            "whatsNew.v270.title": "Başlangıç Rehberi ve Veri İçe Aktarma",
            "whatsNew.v270.guide": "<strong>Yeni Başlangıç Rehberi:</strong><br/>Yeni adım adım rehberimizle hızlıca başla.",
            "whatsNew.v270.import": "<strong>Veri İçe Aktarma:</strong><br/>Mevcut verilerini CSV dosyalarıyla kolayca içe aktar.",
            "whatsNew.v250.title": "Verini birkaç dakikada bir görselleştir",
            "whatsNew.v250.description": "Artık her X dakikada ne kadar veri kullandığını görmek için takibi açabilirsin. Yeni çizgi grafiğimizle veri kullanım trendini izle, kontrolü elinde tut ve sürprizlerden kaçın.",
            "whatsNew.v240.title": "Özel Parçacıklar ve Yeni Pill Şekilleri",
            "whatsNew.v240.description": "Yeni etkileşimli Pill özelliğimizle yaratıcılığını kullan!",
            "whatsNew.v240.particles": "<strong>Animasyonlu Parçacıklar:</strong><br/>Pill'lerinin içinde yukarı, aşağı veya herhangi bir yöne hareket eden parçacıklar ekle.",
            "whatsNew.v240.control": "<strong>Tam Kontrol:</strong><br/>Parçacık şeklini, hızını, opaklığını ve daha fazlasını özelleştir.",
            "whatsNew.v240.options": "<strong>Daha Fazla Pill Seçeneği:</strong><br/>Temel şekillerden eğlenceli emoji Pill'lerine kadar seçim yap.",
            "whatsNew.v230.title": "Uygulama Uyarıları ve İpuçları",
            "whatsNew.v230.description": "Veri kullanımını kontrol altında tutmana yardımcı olacak akıllı uyarılar ve faydalı ipuçları ekledik!",
            "whatsNew.v230.alerts": "<strong>Gerçek Zamanlı Uyarılar:</strong><br/>Mobil veri limitine ulaştığında veya limiti aştığında doğrudan uygulama içinde bildirim al.",
            "whatsNew.v230.tips": "<strong>Veri Tasarrufu için Akıllı İpuçları:</strong><br/>Veri kullanımını azaltmak ve aşımı önlemek için kolay, pratik yollar keşfet.",
            "whatsNew.v220.title": "Lockscreen ve Homescreen'de Daha Fazla Widget",
            "whatsNew.v220.description": "Haftalık kullanımı homescreen'de gör ve yeni kompakt widget ile lockscreen'de diğer widget'lara yer aç.",
            "whatsNew.v210.title": "Kayıt Geçmişi ve Widget Özelleştirme",
            "whatsNew.v210.description": "Geçmiş verileri grafikte görüntüle ve arka plan ile metin rengini değiştirerek widget'ların görünümünü özelleştir.",
            "whatsNew.v200.title": "Yenilenen Arayüz",
            "whatsNew.v200.description": "Bu Hafta kullanımını, ilerlemeyi ve plan ilerlemesini gösteren yeni kartlar eklendi. Ayrıca veri planı dönemi türünü Range veya Day olarak değiştirebilirsin.",
            "whatsNew.v200.superTitle": "Super Pill Plan'da Daha Fazla Özellik",
            "whatsNew.v200.insights": "Veri İçgörüleri Kartı",
            "whatsNew.v200.shape": "Pill Şeklini ve Akışını Özelleştir",
            "whatsNew.v200.widgets": "Widget'ları Özelleştir",
            "whatsNew.v200.icon": "Uygulama Simgesini ve Aksanı Özelleştir",
            "whatsNew.v200.records": "Tüm Veri Kayıtlarını Görüntüle ve Dışa Aktar",
            "whatsNew.v130.title": "Veri Birimi",
            "whatsNew.v130.description": "Veri kullanımını görüntülemek için artık GB veya MB arasında geçiş yapabilirsin.",
            "whatsNew.v120.title": "Ayarlanabilir Bildirim Eşiği",
            "whatsNew.v120.untracked": "Takip Edilmeyen Veri Miktarı",
            "whatsNew.v120.views": "Bu Haftanın Verileri için Yeni Görünümler",
            "whatsNew.v120.thresholds": "Ayarlanabilir Bildirim Eşikleri",
            "whatsNew.v110.title": "Pill Özelleştirmeleri, Bildirimler"
        },
        fil: {
            "footer.support": "Suporta",
            "footer.help": "Tulong",
            "footer.whatsNew": "Ano ang Bago",
            "home.title": "Data Pill",
            "home.subtitle": "Madaling i-monitor ang data usage mo, nasaan ka man.",
            "home.plan.title": "Data Plan Management",
            "home.plan.description": "I-customize ang data plan mo, mag-set ng usage limits, at i-visualize ang data consumption gamit ang unique pill-shaped bar.",
            "home.flexible.title": "Flexible Options para sa Non-Data Plans",
            "home.flexible.description": "I-track ang data mo gamit ang daily budgets, kahit walang traditional data plan.",
            "home.widgets.title": "Monitor Anywhere, Anytime",
            "home.widgets.description": "Manatiling updated sa isang tingin gamit ang widgets sa home at lock screens.",
            "support.title": "Suporta",
            "support.card.title": "Kailangan ng tulong?",
            "support.emailIntro": "Para sa feedback o anumang issue, kontakin kami sa email:",
            "support.appSettings": "Pwede ka ring pumunta sa 'Report a Bug' o 'Request a Feature' sa app settings.",
            "lang.en": "English",
            "lang.de": "German",
            "lang.tr": "Turkish",
            "lang.zh": "Chinese",
            "lang.fil": "Filipino",
            "help.title": "Tulong",
            "help.meta": "Ni PenguinWorksCo<br>Huling Na-update: 24 Hul 2026",
            "help.guide.title": "Gabay sa Data Pill",
            "help.guide.description": "Mabilis na sagot para sa pag-set up ng data plan, pagbasa ng Pill, pagdagdag ng widgets, at pag-back up ng records mo.",
            "help.topic.basics": "Basics",
            "help.topic.streak": "Streak",
            "help.topic.pill": "Pill",
            "help.topic.widget": "Widget",
            "help.topic.notifications": "Notifications",
            "help.topic.backup": "Backup",
            "help.topic.data": "Data",
            "help.topic.languages": "Languages",
            "help.basics.dataPlan.q": "Ano ang Data Plan?",
            "help.basics.dataPlan.a": "Ang data plan ay serbisyo mula sa mobile carriers na nagbibigay ng internet access sa mobile device kapalit ng nakatakdang bayad.",
            "help.basics.setPlan.q": "Paano i-set ang Data Plan?",
            "help.basics.setPlan.a": "Kailangan mong i-set ang period at data amount ng plan mo. Maaari itong i-edit mula sa Data Plan card.",
            "help.basics.disablePlan.q": "Paano i-disable ang Data Plan?",
            "help.basics.disablePlan.a": "Pwede mong i-disable ang data plan gamit ang switch kung gusto mo lang i-monitor ang data araw-araw.",
            "help.basics.period.q": "Ano ang pagkakaiba ng Manual at Auto Period?",
            "help.basics.period.auto": "<strong>Auto:</strong> Awtomatikong sine-set ang susunod na billing cycle o period.",
            "help.basics.period.manual": "<strong>Manual:</strong> Ikaw mismo ang magse-set ng period.",
            "help.basics.period.note": "<strong>Note:</strong> Magiging pula ang Plan Period dates kung ang petsa ngayon ay wala sa napiling period.",
            "help.basics.dailyPlan.q": "Ano ang pagkakaiba ng Daily at Plan Usage?",
            "help.basics.dailyPlan.daily": "Ang daily usage ay ang dami ng data na nagamit sa loob ng isang araw.",
            "help.basics.dailyPlan.plan": "Ang plan usage ay ang kabuuang data usage sa loob ng billing cycle ng mobile carrier mo.",
            "help.basics.dataAmount.q": "Ano ang Data Amount?",
            "help.basics.dataAmount.a": "Ito ang maximum na internet data na pwede mong gamitin sa billing cycle nang walang extra charge o reduced speed.",
            "help.basics.untracked.q": "Ano ang Untracked Amount?",
            "help.basics.untracked.a": "Ito ang data usage mula sa mobile internet plan mo bago mo na-install ang Data Pill. Idadagdag ito sa total usage mo para sa kasalukuyang period.",
            "help.basics.dailyLimit.q": "Ano ang Daily Limit?",
            "help.basics.dailyLimit.a": "Ito ang daily threshold na sine-set ng app para ma-notify ka kung lumampas ka sa daily limit.",
            "help.basics.planLimit.q": "Ano ang Plan Limit?",
            "help.basics.planLimit.a": "Katulad ito ng Daily Limit, pero para sa buong plan period.",
            "help.streak.what.q": "Ano ang Streak?",
            "help.streak.what.a1": "Sinusubaybayan ng Streak kung ilang sunod-sunod na araw kang hindi lumalampas sa daily usage limit mo. Kapag hindi ka lumampas sa daily limit, tuloy ang streak mo.",
            "help.streak.what.a2": "Kailangan ng valid Daily Limit para sa Streak. Kung naka-enable ang Data Plan, kailangan ding nasa current plan period ang araw ngayon.",
            "help.streak.rewards.q": "Paano gumagana ang Streak Rewards?",
            "help.streak.rewards.a1": "Kapag umabot ka sa ilang milestone tulad ng 7, 14, 30, o 60 days, pwede kang mag-claim ng reward. Bawat reward ay nag-a-unlock ng Super Trial sa loob ng 7 days para ma-experience mo ang premium features ng Data Pill.",
            "help.streak.rewards.a2": "Kung mag-claim ka ulit habang active ang Super Trial, ie-extend ng app ang trial mo.",
            "help.pill.what.q": "Ano ang Pill?",
            "help.pill.what.a": "Ang Pill ay visual indicator na nagpapakita ng daily o plan usage mo. Mabilis nitong ipinapakita ang data consumption mo.",
            "help.pill.week.q": "Paano ipakita ang Daily Usage para sa Week?",
            "help.pill.week.a": "I-tap ang Pill, pagkatapos ay mag-swipe pakaliwa para makita ang daily usage sa nakaraang 7 araw.",
            "help.pill.period.q": "Paano ipakita ang lahat ng Daily Usage para sa Current Period?",
            "help.pill.period.a": "I-tap ang Pill, pagkatapos ay mag-scroll pababa para makita ang buong breakdown ng usage mo sa kasalukuyang billing period.",
            "help.widget.home.q": "Paano magdagdag ng Widget sa Homescreen?",
            "help.widget.home.a": "Para magdagdag ng widget sa homescreen, long-press sa home screen at i-tap ang + button sa top-right ng screen. Hanapin ang \"Data Pill\" widget at piliin ang size na gusto mo.",
            "help.widget.lock.q": "Paano magdagdag ng Widget sa Lockscreen?",
            "help.widget.lock.a": "Para magdagdag ng widget sa lockscreen, long-press sa lockscreen at i-tap ang \"Customize\". I-tap ang bottom widget area at idagdag ang \"Data Pill\" widget.",
            "help.widget.standby.q": "Paano idagdag sa StandBy?",
            "help.widget.standby.a": "Para magdagdag ng widget sa StandBy screen, long-press ang screen habang nasa StandBy display. I-unlock ang phone, i-tap ang + button sa top-left, hanapin ang \"Data Pill\" widget, i-tap ang \"Add Widget\", pagkatapos ay \"Done\".",
            "help.widget.planUsage.q": "Bakit hindi ko makita ang Plan Usage?",
            "help.widget.planUsage.a1": "Kailangan mong i-edit ang widget sa homescreen sa pamamagitan ng long-press. I-set ang Usage Type sa Daily para makita ang usage today, o Plan para makita ang overall usage sa current period o cycle.",
            "help.widget.planUsage.a2": "Para sa small widgets, pwede mo ring palitan ang Small Widget sa Data Usage o Days Left. Pwede ka ring magdagdag ng isa pang widget na may ibang configuration, tulad ng days left sa period.",
            "help.widget.notUpdating.q": "Bakit hindi nag-u-update ang Widget?",
            "help.widget.notUpdating.a": "Karaniwang nag-u-update ang widgets bawat 5 minuto. Pero pwedeng ma-delay kung hindi mo aktibong ginagamit ang app o kung naabot mo na ang daily limit na 40-60 refreshes.",
            "help.widget.blank.q": "Bakit Blank o Black ang Widget ko?",
            "help.widget.blank.a": "Sa iOS 17, maaaring maging black ang widget pagkatapos i-update ang app. iOS issue ito. Para ayusin, i-restart ang device o alisin at idagdag muli ang widget sa homescreen.",
            "help.notifications.notWorking.q": "Bakit hindi gumagana ang Notifications?",
            "help.notifications.notWorking.a": "Siguraduhing naka-enable ang notifications sa dalawang lugar:",
            "help.notifications.device": "Device Settings:",
            "help.notifications.app": "App Settings:",
            "help.path.deviceNotifications": "Settings > Data Pill > Notifications > Allow Notifications",
            "help.path.appNotifications": "Settings > Notifications > Daily Usage & Plan Usage",
            "help.backup.how.q": "Paano i-backup at i-restore ang Records ko?",
            "help.backup.how.a1": "Para i-backup ang data mo, i-enable ang \"Data Pill\" backup sa Settings.",
            "help.path.icloud": "Settings > [Your Name] > [This Device] > iCloud Backup > [This Device Backup] > Enable \"Data Pill\"",
            "help.backup.how.a2": "Sa Super Pill, pwede mo ring i-backup nang manual ang data mo sa pamamagitan ng pag-export nito bilang <strong>CSV file</strong> mula sa Records.",
            "help.path.exportCsv": "Settings > Show All Records > Export to CSV",
            "help.backup.csv.intro": "Kapag nagre-restore mula sa CSV file, required ang unang dalawang columns. Tinatanggap ang extra columns mula sa Data Pill exports at ini-ignore ang mga ito sa import.",
            "help.backup.csv.columns": "Required columns: <strong>Date</strong> at <strong>Used Amount in MB</strong>.",
            "help.backup.csv.date": "Dapat d MMM yyyy ang date format. Pwedeng German, Turkish, Chinese, Filipino, o English ang month names.",
            "help.backup.csv.amount": "Ang Used Amount in MB ay dapat valid na number.",
            "help.backup.csv.structure": "Panatilihing eksaktong pareho ang file structure para smooth ang import.",
            "help.data.accuracy.q": "Bakit hindi accurate ang Usage sa App?",
            "help.data.accuracy.a": "Maaaring may +/- 1-5 MB na difference dahil sa API limitations. Tingnan ang phone settings para sa eksaktong data usage.",
            "help.data.speed.q": "Paano kinakalkula ng App ang Speed?",
            "help.data.speed.a1": "Kapag naka-enable ang \"Tracking Data Amount Throughout the Day\" sa Settings, sinusubukan ng app na i-record ang data used bawat 5 minuto, o ayon sa napiling time interval. Pero hindi ito palaging precise dahil nakadepende ang widget updates sa refresh schedule ng system. Kapag may na-miss na intervals, ina-average ng app ang available data.",
            "help.path.dataUpdates": "Settings > Data Updates > Track Data Amount Throughout the Day",
            "help.data.speed.a2": "Halimbawa, kung gumamit ka ng 0.1 MB sa huling 3 intervals, kakalkulahin ng app ang average bilang 0.1 MB / 3 = 0.033 MB. Ina-average ang lahat ng non-cumulative data points sa buong araw at ipinapakita bilang speed, tulad ng x MB / 5 min.",
            "help.data.track.q": "Bakit hindi nata-track ang data usage ko?",
            "help.data.track.a1": "Para ma-track ang data usage habang hindi bukas ang app, kailangan mong idagdag ang widget sa home screen o lock screen.",
            "help.data.track.a2": "Para sa throughout-the-day tracking at speed statistics, kailangan mo rin ng Super Pill at naka-enable na Data Updates tracking setting.",
            "help.data.track.a3": "Ina-update lang ng widget ang data usage mo kapag ni-refresh ito ng system. Kung hindi pa naidagdag ang widget o hindi pa ito na-refresh, hindi mag-u-update ang data.",
            "help.languages.title": "Supported Languages",
            "help.languages.change": "Para baguhin ang app language, pumunta sa:",
            "help.path.language": "Device Settings > Apps > Data Pill > Language > Select Language",
            "whatsNew.title": "Ano ang Bago",
            "whatsNew.v290.title": "Streaks, Rewards at Dynamic Themes",
            "whatsNew.v290.streaks": "<strong>Daily Streaks:</strong><br/>Manatili sa safe zone at bumuo ng streak habang minamanage mo ang data plan araw-araw.",
            "whatsNew.v290.rewards": "<strong>Streak Rewards:</strong><br/>Maabot ang streak milestones para ma-unlock ang Super Pill trial days at mapatuloy ang progress mo.",
            "whatsNew.v290.daysLeft": "<strong>Days Left:</strong><br/>Tingnan kung ilang araw pa ang natitira sa plan mo direkta sa app at sa widgets.",
            "whatsNew.v290.themes": "<strong>Dynamic Themes:</strong><br/>Pumili ng System, Dark, o Light mode, gamit ang improved widget colors na umaangkop sa look mo.",
            "whatsNew.v290.homeWidgets": "<strong>Mas Smart na Home at Widgets:</strong><br/>Mas madaling makita sa isang tingin ang streaks, data status, days left, at Super Pill subscription details.",
            "whatsNew.v270.title": "Startup Guide at Import Data",
            "whatsNew.v270.guide": "<strong>Bagong Startup Guide:</strong><br/>Magsimula agad gamit ang bagong step-by-step guide.",
            "whatsNew.v270.import": "<strong>Import Data:</strong><br/>Madaling i-import ang existing data gamit ang CSV files.",
            "whatsNew.v250.title": "I-visualize ang data mo bawat ilang minuto",
            "whatsNew.v250.description": "Pwede mo nang i-enable ang tracking para makita kung gaano karaming data ang nagamit mo bawat X minutes. Bantayan ang data usage trend gamit ang bagong line chart para manatili kang in control at maiwasan ang surprises.",
            "whatsNew.v240.title": "Custom Particles at Bagong Pill Shapes",
            "whatsNew.v240.description": "Maging creative sa bagong interactive pill feature!",
            "whatsNew.v240.particles": "<strong>Animated Particles:</strong><br/>Magdagdag ng particles na gumagalaw pataas, pababa, o kahit anong direksyon sa loob ng pills mo.",
            "whatsNew.v240.control": "<strong>Full Control:</strong><br/>I-customize ang particle shape, speed, opacity, at iba pa.",
            "whatsNew.v240.options": "<strong>More Pill Options:</strong><br/>Pumili mula basic shapes hanggang fun emoji pills.",
            "whatsNew.v230.title": "App Alerts at Tips",
            "whatsNew.v230.description": "Nagdagdag kami ng smart alerts at helpful tips para matulungan kang kontrolin ang data usage mo!",
            "whatsNew.v230.alerts": "<strong>Real-time Alerts:</strong><br/>Makakatanggap ka ng notification kapag naabot o nalampasan mo ang mobile data limit - direkta sa app.",
            "whatsNew.v230.tips": "<strong>Smart Tips to Save Data:</strong><br/>Makahanap ng simple at practical na paraan para bawasan ang data usage at maiwasan ang overages.",
            "whatsNew.v220.title": "Mas Maraming Widgets sa Lockscreen at Homescreen",
            "whatsNew.v220.description": "Tingnan ang weekly usage sa homescreen at magbakante ng space para sa ibang widgets sa lockscreen gamit ang bagong compact widget.",
            "whatsNew.v210.title": "Record History at Widget Customization",
            "whatsNew.v210.description": "Tingnan ang past data sa chart at i-customize ang appearance ng widgets sa pamamagitan ng pagbabago ng background at text color.",
            "whatsNew.v200.title": "Revamped UI",
            "whatsNew.v200.description": "Nagdagdag ng bagong cards para ipakita ang This Week usage, progress, at plan progress. Pwede mo ring palitan ang type of period para sa data plan bilang Range o Day.",
            "whatsNew.v200.superTitle": "Mas Maraming Features sa Super Pill Plan",
            "whatsNew.v200.insights": "Data Insights Card",
            "whatsNew.v200.shape": "Customize Pill Shape and Flow",
            "whatsNew.v200.widgets": "Customize Widgets",
            "whatsNew.v200.icon": "Customize App Icon and Accent",
            "whatsNew.v200.records": "View & Export All Data Records",
            "whatsNew.v130.title": "Data Unit",
            "whatsNew.v130.description": "Pwede ka nang lumipat sa GB o MB para tingnan ang data usage mo.",
            "whatsNew.v120.title": "Adjustable Notification Threshold",
            "whatsNew.v120.untracked": "Untracked Data Amount",
            "whatsNew.v120.views": "New Views for This Week's Data",
            "whatsNew.v120.thresholds": "Adjustable Notification Thresholds",
            "whatsNew.v110.title": "Pill Customizations, Notifications"
        }
    };

    let activeLanguage = "en";
    let isApplying = false;

    function normalizeLanguage(language) {
        if (!language || typeof language !== "string") {
            return null;
        }

        const code = language.toLowerCase();

        if (code === "zh-hans" || code.startsWith("zh")) {
            return "zh-Hans";
        }

        if (code.startsWith("de")) {
            return "de";
        }

        if (code.startsWith("tr")) {
            return "tr";
        }

        if (code.startsWith("fil") || code.startsWith("tl")) {
            return "fil";
        }

        if (code.startsWith("en")) {
            return "en";
        }

        return null;
    }

    function getStoredLanguage() {
        try {
            return normalizeLanguage(window.localStorage.getItem(storageKey));
        } catch (error) {
            return null;
        }
    }

    function setStoredLanguage(language) {
        try {
            window.localStorage.setItem(storageKey, language);
        } catch (error) {
            // Private browsing modes can block localStorage.
        }
    }

    function getUrlLanguage() {
        try {
            return normalizeLanguage(new URLSearchParams(window.location.search).get("lang"));
        } catch (error) {
            return null;
        }
    }

    function detectLanguage() {
        const urlLanguage = getUrlLanguage();
        if (urlLanguage) {
            return urlLanguage;
        }

        const storedLanguage = getStoredLanguage();
        if (storedLanguage) {
            return storedLanguage;
        }

        const browserLanguages = Array.isArray(navigator.languages) && navigator.languages.length > 0
            ? navigator.languages
            : [navigator.language];

        for (const browserLanguage of browserLanguages) {
            const matchedLanguage = normalizeLanguage(browserLanguage);
            if (matchedLanguage) {
                return matchedLanguage;
            }
        }

        return "en";
    }

    function t(key, language) {
        return translations[language][key] || translations.en[key] || "";
    }

    function applyTranslations(language) {
        const normalizedLanguage = normalizeLanguage(language) || "en";
        activeLanguage = supportedLanguages.includes(normalizedLanguage) ? normalizedLanguage : "en";
        isApplying = true;

        document.documentElement.setAttribute("lang", activeLanguage);

        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const value = t(element.getAttribute("data-i18n"), activeLanguage);
            if (element.textContent !== value) {
                element.textContent = value;
            }
        });

        document.querySelectorAll("[data-i18n-html]").forEach((element) => {
            const value = t(element.getAttribute("data-i18n-html"), activeLanguage);
            if (element.innerHTML !== value) {
                element.innerHTML = value;
            }
        });

        document.querySelectorAll("[data-i18n-language-select]").forEach((select) => {
            select.value = activeLanguage;
        });

        isApplying = false;
    }

    function bindLanguageSwitchers() {
        document.querySelectorAll("[data-i18n-language-select]").forEach((select) => {
            if (select.dataset.i18nBound === "true") {
                return;
            }

            select.dataset.i18nBound = "true";
            select.addEventListener("change", (event) => {
                const selectedLanguage = normalizeLanguage(event.target.value) || "en";
                setStoredLanguage(selectedLanguage);
                applyTranslations(selectedLanguage);
            });
        });
    }

    function init() {
        applyTranslations(detectLanguage());
        bindLanguageSwitchers();

        const observer = new MutationObserver((mutations) => {
            if (isApplying) {
                return;
            }

            const addedTranslatableContent = mutations.some((mutation) => {
                return Array.from(mutation.addedNodes).some((node) => {
                    return node.nodeType === Node.ELEMENT_NODE;
                });
            });

            if (!addedTranslatableContent) {
                return;
            }

            window.requestAnimationFrame(() => {
                bindLanguageSwitchers();
                applyTranslations(activeLanguage);
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    window.DataPillI18n = {
        applyTranslations,
        detectLanguage,
        getLanguage: () => activeLanguage,
        setLanguage: (language) => {
            const normalizedLanguage = normalizeLanguage(language) || "en";
            setStoredLanguage(normalizedLanguage);
            applyTranslations(normalizedLanguage);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
}());
