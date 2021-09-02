import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from '../router';

Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

axios.defaults.withCredentials = true;

const engineAPI = 'https://corpsum-proxy.acdh-dev.oeaw.ac.at/run.cgi/';

Vue.use(Vuex);

export async function getKWIC(queryTermEncoded, selectedCorpus, subCorp) {
    const viewattrsxURI = `${engineAPI}viewattrsx?q=${queryTermEncoded};corpname=${selectedCorpus};${subCorp}viewmode=kwic;attrs=word;ctxattrs=word;setattrs=word;allpos=kw;setrefs==doc.id;setrefs==doc.datum;setrefs==doc.region;setrefs==doc.ressort2;setrefs==doc.docsrc_name;pagesize=1000;newctxsize=30;async=0;format=json`
    try {
        const response = await axios.get(viewattrsxURI);
        return response;
    } catch (error) {
        console.log(error)
    }
}

/**
 * This method provides access to the frequenct statistics
 * The attribute that stands at the core of the request (fttattr) is the year
 * 
 * @returns response from the get function
 */
export async function getTemporal(queryTermEncoded, selectedCorpus, useSubCorp) {
    const freqttURI = `${engineAPI}freqtt?q=${queryTermEncoded};corpname=${selectedCorpus};${useSubCorp}fttattr=doc.year;fcrit=doc.id;flimit=0;format=json`;
    try {
        const response = await axios.get(freqttURI);
        return response;
    } catch (error) {
        console.log(error);
    }
}

/**
 * This method provides collocation candidates computation
 * 
 */
export async function getCollx(queryTerm, metaAttr, metaVal, selectedCorpus, useSubCorp) {
    const queryTermEncoded = encodeURIComponent(`aword,${queryTerm} within <doc ${metaAttr}=${metaVal}/>`);
    const collxURI = `${engineAPI}collx?q=${queryTermEncoded};corpname=${selectedCorpus};${useSubCorp}cfromw=-5;ctow=5;cminfreq=5;cminbgr=3;cmaxitems=10;cbgrfns=d;csortfn=d;format=json`;
    try {
        const responseColl = await axios.get(collxURI);
        return responseColl;
    } catch (error) {
        console.log(error);
    }
}

export async function getRegionFreq(queryTerm, metaAttr, metaVal, selectedCorpus, useSubCorp) {
    const queryTermEncoded = encodeURIComponent(`aword,${queryTerm} within <doc ${metaAttr}="${metaVal}"/>`);
    const viewattrsxURI = `${engineAPI}viewattrsx?q=${queryTermEncoded};corpname=${selectedCorpus};${useSubCorp}viewmode=kwic;attrs=word;ctxattrs=word;setattrs=word;allpos=kw;setrefs==doc.id;setrefs==doc.region;pagesize=10;newctxsize=5;async=0;format=json`;
    try {
        const response = await axios.get(viewattrsxURI);
        return response;
    } catch (error) {
        console.log(error);
    }
}

/**
 * This method provides access to the frequency statistics.
 *
 */
export async function getWordForms(queryTermEncoded, selectedCorpus, useSubCorp) {
    const freqsURI = `${engineAPI}freqs?q=${queryTermEncoded};corpname=${selectedCorpus};${useSubCorp}fcrit=word/e 0~0>0;flimit=0;format=json`;
    try {
        const response = await axios.get(freqsURI);
        return response;
    } catch (error) {
        console.log(error);
    }
}

/**
 * docsrc
 * 
 */
export async function getMediaSourcesFreq(queryTermEncoded, selectedCorpus, useSubCorp) {
    const freqttURI = `${engineAPI}freqtt?q=${queryTermEncoded};corpname=${selectedCorpus};${useSubCorp}fttattr=doc.docsrc;fcrit=doc.id;flimit=0;format=json`;
    try {
        const response = await axios.get(freqttURI);
        return response;
    } catch (error) {
        consosle.log(error);
    }
}

/**
 * This method provides the functionality of “word list” and “keywords” functions that are normally available under the link “Word List” in the web interface
 * The corpus attribute that we work with here is docsrc
 */
export async function getWordlistDorcsrc(selectedCorpus) {
    const wordlistDocsrcURI = `${engineAPI}wordlist?corpname=${selectedCorpus};wlmaxitems=1000;wlattr=doc.docsrc;wlminfreq=1;include_nonwords=1;wlsort=f;wlnums=docf;format=json`;
    try {
        const response = await axios.get(wordlistDocsrcURI);
        return response;
    } catch (error) {
        consosle.log(error);
    }
}

/**
 * This method provides the functionality of “word list” and “keywords” functions that are normally available under the link “Word List” in the web interface
 * The corpus attributes: year, region, docsrc_name, ressort2
 */
export async function getCorpusInfo(selectedCorpus, subCorp) {
    const requestURIs = {};
    requestURIs.docsYears = `${engineAPI}wordlist?corpname=${selectedCorpus};${subCorp}wlmaxitems=1000;wlattr=doc.year;wlminfreq=1;include_nonwords=1;wlsort=f;format=json`;
    requestURIs.docsRegions = `${engineAPI}wordlist?corpname=${selectedCorpus};${subCorp}wlmaxitems=1000;wlattr=doc.region;wlminfreq=1;include_nonwords=1;wlsort=f;wlnums=docf;format=json`;
    requestURIs.docsSources = `${engineAPI}wordlist?corpname=${selectedCorpus};${subCorp}wlmaxitems=1000;wlattr=doc.docsrc_name;wlminfreq=1;include_nonwords=1;wlsort=f;wlnums=docf;format=json`;
    requestURIs.docsRessorts = `${engineAPI}wordlist?corpname=${selectedCorpus};${subCorp}wlmaxitems=1000;wlattr=doc.ressort2;wlminfreq=1;include_nonwords=1;wlsort=f;wlnums=docf;format=json`;
    requestURIs.corpInfo = `${engineAPI}corp_info?corpname=${selectedCorpus}&format=json&subcorpora=1`;
    // requestURIs.topLemmas = `${engineAPI}wordlist?corpname=${selectedCorpus};${subCorp}wlmaxitems=50;wlattr=lemma;wlminfreq=5;wlsort=f;wlnums=frq;format=json`;

    try {
        const responses = {};
        responses.docsYears = await axios.get(requestURIs.docsYears);
        responses.docsRegions = await axios.get(requestURIs.docsRegions);
        responses.docsSources = await axios.get(requestURIs.docsSources);
        responses.docsRessorts = await axios.get(requestURIs.docsRessorts);
        responses.corpInfo = await axios.get(requestURIs.corpInfo);
        // responses.topLemmas = await axios.get(requestURIs.topLemmas);

        return responses;
    } catch (error) {
        console.log(error);
    }

}