import styles from './wiki.module.css';

export default function WikiPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>— The Sacred Texts —</p>
        <h1 className={styles.title}>The Lore of the First Slapper</h1>
        <div className={styles.divider} />

        <div className={styles.body}>
          <p className={styles.drop}>
            In the age before the Great Slapping, there lived a man whose name hath been
            carved into stone and whispered by ravens — <strong>Aldric of the Ordinary</strong>.
            He dwelt not in a castle, nor in a keep of iron and glory. He dwelt in a small flat
            on the third floor, with a broken radiator and a neighbour who played drum and bass
            past midnight.
          </p>

          <p>
            His days were as grey as the sky above his city. He toiled. He commuted. He ate
            his lunch at his desk and stared into a glowing rectangle as the hours bled away.
            And yet — in the marrow of his bones — there stirred something ancient. Something
            that did not belong to spreadsheets or Monday mornings. A fire that no ordinary life
            could quench.
          </p>

          <p>
            He knew not what it was. Only that something was <em>missing.</em>
          </p>

          <h2 className={styles.chapter}>I. The Vision</h2>

          <p>
            On the fortieth night of his discontent, the sky cracked open and spoke not with
            thunder — but with silence so complete that Aldric sat upright in his bed, sweat upon
            his brow, heart hammering like a war drum. He had dreamed of a battlefield that
            stretched beyond the horizon. Of warriors who fought not with swords, but with the
            bare and righteous <em>open palm.</em>
          </p>

          <p>
            He saw himself among them. Not the man he was — hunched, tired, unremarkable —
            but the man he was <em>meant</em> to be. Tall as shadow. Quick as thought.
            His hand raised high, and the sound that followed shook the very foundations
            of the earth.
          </p>

          <p className={styles.quote}>
            "Rise,"<br />
            said the Voice between worlds.<br />
            "The arena doth not wait<br />
            for men who sleep."
          </p>

          <h2 className={styles.chapter}>II. The Calling</h2>

          <p>
            His colleagues thought him changed. And they were right to think so.
            Where once he had nodded through meetings and accepted whatever fate
            handed him on a plate, now his eyes held a different light. The light
            of a man who hath seen behind the veil of the ordinary world — and
            found it wanting.
          </p>

          <p>
            For Aldric had begun to understand what the Vision demanded of him.
            Not to build an ark of wood and pitch, as the ancient Noa had done
            when the waters rose. But to build something far stranger:
            a <strong>fellowship of slappers.</strong>
          </p>

          <p>
            They laughed at him. As they had always laughed at those who saw
            beyond what others could see. But Aldric did not waver.
            He had been wandering all his life — a ranger without a throne,
            a chosen one who had yet to choose. Now he chose.
          </p>

          <h2 className={styles.chapter}>III. The First Slap</h2>

          <p>
            On a Tuesday — for the great moments of history care nothing for
            the grandeur of the day — Aldric met his first opponent on a street
            corner in the rain. A stranger whose phone had pinged. Whose blood
            had stirred at the same ancient frequency.
          </p>

          <p>
            They stood facing each other. No words were necessary.
            The world narrowed to a single point of absolute clarity,
            the way it does in the moment before everything changes.
          </p>

          <p>
            And then —
          </p>

          <p className={styles.quote}>
            <strong>SLAP.</strong>
          </p>

          <p>
            The sound rang through the ages. Birds scattered from rooftops.
            A car alarm wailed in the distance. And Aldric of the Ordinary
            — who had once eaten sad sandwiches at his desk and wondered
            if this was all there was — felt, for the first time, entirely
            and unmistakably <em>alive.</em>
          </p>

          <h2 className={styles.chapter}>IV. The Prophecy</h2>

          <p>
            The old texts speak of what is yet to come. Of a Great Tournament
            that shall gather the mightiest slappers from every corner of the
            known world. Of dungeons yet unplumbed. Of items of such terrible
            power that men have gone mad merely reading their stat rolls.
          </p>

          <p>
            And at the centre of it all — a throne. Awaiting the one whose
            palm strikes truest, whose reflexes are sharpest, whose will
            doth not break when the bot hits back harder than expected.
          </p>

          <p>
            That throne hath no name yet.
          </p>

          <p>
            It waits for <em>thine.</em>
          </p>

          <div className={styles.divider} />
          <p className={styles.footer}>
            — Transcribed from the Codex Palmicus, Vol. I —
          </p>
        </div>
      </div>
    </div>
  );
}
