/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import { getFeature, postFeature } from '../lib/api/feature';

export type basicFeatureItem = {
  index: number;
  title: string;
  image: string;
  description?: string;
};

export type linkFeatureItem = {
  index: number;
  title: string;
  image: string;
  to?: string;
  href?: string;
};

const basicFeatureList: basicFeatureItem[] = [
  {
    "index": 1,
    "title": "Easy to Use",
    "image": "/img/undraw_docusaurus_mountain.svg",
    "description": "Docusaurus was designed from the ground up to be easily installed and used to get your website up and running quickly."
  },
  {
    "index": 2,
    "title": "Focus on What Matters",
    "image": "/img/undraw_docusaurus_tree.svg",
    "description": "Docusaurus was designed from the ground up to be easily installed and used to get your website up and running quickly."
  },
  {
    "index": 3,
    "title": "Powered by React",
    "image": "/img/undraw_docusaurus_react.svg",
    "description": "Docusaurus was designed from the ground up to be easily installed and used to get your website up and running quickly."
  }
];

const linkFeatureList: linkFeatureItem[] = [
  {
    "index": 1,
    "title": "Easy to Use",
    "image": "/img/rose.png",
    "to": "/docs/intro",
    "href": ""
  },
  {
    "index": 2,
    "title": "Focus on What Matters",
    "image": "/img/light.jpeg",
    "to": "/docs/tutorial-basics/create-a-page",
    "href": ""
  },
  {
    "index": 3,
    "title": "Powered by React",
    "image": "/img/wall.jpeg",
    "to": "/docs/tutorial-extras/manage-docs-versions",
    "href": ""
  }
];

function BasicFeature({ index, title, image, description }: basicFeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img className={styles.featureSvg} alt={title} src={image} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function LinkFeature({ index, title, image, to, href }: linkFeatureItem) {

  const onClickLink = (to: string) => {

  };

  return (
    <div
      className={clsx("linkFeature-item-container")}
      role="presentation"
      onClick={() => onClickLink(to)}
    >
      <div className="linkFeature-item-image-div">
        <img className={styles.featureSvg} alt={title} src={image} />
      </div>
      <div className={clsx("text--center", "linkFeature-item-title-div")}>
        <span className="linkFeature-item-title">{title}</span>
      </div>
    </div>
  );
}


export default function HomepageFeatures(): JSX.Element {
  const [linkFeatureState, setLinkFeatureState] = useState<linkFeatureItem[]>([]);
  const [basicFeatureState, setBasicFeatureState] = useState<basicFeatureItem[]>(basicFeatureList);

  const newLinkId = useRef(4);
  const newBasicId = useRef(4);

  const onClickAddFeature = async (option: string) => {
    if (option === "link") {
      const newItem = {
        "index": newLinkId.current,
        "title": "제목을 입력하세요.",
        "image": "/img/rose.png",
        "to": "/docs/intro",
        "href": ""
      };
      const newState = linkFeatureState.concat(newItem);
      postFeature(newState, "link");
      setLinkFeatureState(newState);
      newLinkId.current++;
    } else {
      const newItem = {
        "index": newBasicId.current,
        "title": "제목을 입력하세요.",
        "image": "/img/undraw_docusaurus_mountain.svg",
        "description": "설명을 입력하세요."
      };
      const newState = basicFeatureState.concat(newItem);
      postFeature(newState, "basic");
      setBasicFeatureState(newState);
      newLinkId.current++;
    }
  };

  useEffect(() => {
    const getState = async () => {
      const data = await getFeature();
      const { link, basic } = data.data.feature.items;
      // 추가될 link indexId 값 만들어주는 것
      if (link.length > 0) {
        newLinkId.current = link[link.length - 1].index + 1;
      }
      else {
        newLinkId.current = 1;
      }
      // 추가될 basic indexId 값 만들어주는 것
      if (basic.length > 0) {
        newBasicId.current = basic[basic.length - 1].index + 1;
      }
      else {
        newBasicId.current = 1;
      }
      setLinkFeatureState(link);
      setBasicFeatureState(basic);
    }
    getState();
  }, []);

  return (
    <>
      <section className={clsx(styles.features, "linkSection")}>
        <div className="container">
          <button onClick={() => onClickAddFeature("link")}>feature 추가</button>
          <div className="row">
            {linkFeatureState.map((props) => (
              <LinkFeature key={props.index} {...props} />
            ))}
          </div>
        </div>
      </section>
      <section className={clsx(styles.features, "basicSection")}>
        <div className="container">
          <button onClick={() => onClickAddFeature("basic")}>feature 추가</button>
          <div className="row">
            {basicFeatureState.map((props) => (
              <BasicFeature key={props.index} {...props} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
