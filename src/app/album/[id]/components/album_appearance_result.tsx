"use client";

import { Inter } from "@next/font/google";
import styles from "@/app/styles/page.module.css";
import "@/app/styles/styles.css";
import "@/app/styles/accordion.css";
import React, { useState } from "react";
import Link from "next/link";
import DotsLoader from "@/app/components/dots_loader";
import SampleResult from "@/app/components/sample_result";

const inter = Inter({ subsets: ["latin"] });

async function getSamples(id: String) {
  let headers = new Headers();
  headers.append(
    "X-RapidAPI-Key",
    process.env.NEXT_PUBLIC_RAPID_API_KEY as string
  );
  headers.append("X-RapidAPI-Host", "genius-song-lyrics1.p.rapidapi.com");
  const options: RequestInit = {
    method: "GET",
    headers: headers,
    cache: "no-store",
  };

  return fetch(
    "https://genius-song-lyrics1.p.rapidapi.com/song/details/?id=" + id,
    options
  )
    .then((response) => response.json())
    .then((data) => data["song"]["song_relationships"]["0"]["songs"])
    .catch((err) => console.error(err));
}

export default function AlbumAppearanceResult({ songData }: any) {
  const { song } = songData || {};

  const [samples, setSamples] = useState([] as any[]);

  const [loading, setLoading] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const [hidden, setHidden] = useState(true);

  const handleClick = async () => {
    if (!loaded && !loading) {
      setHidden(false);
      setLoading(true);
      let data = await getSamples(song.id);
      setSamples(data);
      setLoading(false);
      setLoaded(true);
    } else {
      setHidden(!hidden);
    }
  };

  return (
    <>
      <input className="accordion" type="checkbox" id={song.id} />
      <label
        htmlFor={song.id}
        className="cardish albumAppearance"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginLeft: "0.5rem",
        }}
        onClick={handleClick}
      >
        <div>
          <Link href={`/samples/${song.id}`} className={inter.className}>
            <h4 className="textLink">{song["title"]}</h4>
          </Link>
          <p className={inter.className}>{song["artist_names"]}</p>
        </div>
      </label>

      <div className="content">
        {!hidden && (
          <div className={styles.grid}>
            {loading ? (
              <p className={inter.className} style={{ margin: "2rem" }}>
                <DotsLoader />
              </p>
            ) : (
              loaded &&
              (samples?.length > 0 ? (
                samples?.map((sample) => {
                  return (
                    <SampleResult
                      key={sample.id}
                      parent={{
                        id: song.id,
                        title: song["title"],
                        artist: song["artist_names"],
                        year: song["release_date_components"]
                          ? song["release_date_components"]["year"]
                          : "-",
                        imgUrl: song["song_art_image_thumbnail_url"],
                      }}
                      result={{
                        id: sample.id,
                        title: sample["title"],
                        artist: sample["artist_names"],
                        year: sample["release_date_components"]
                          ? sample["release_date_components"]["year"]
                          : "-",
                        imgUrl: sample["song_art_image_thumbnail_url"],
                      }}
                    />
                  );
                })
              ) : (
                <div className="cardish hovered">
                  <p className={inter.className}>No samples found.</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
