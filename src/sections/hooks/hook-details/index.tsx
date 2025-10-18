import React from 'react';
import Layout from "@/sections/hooks/layouts/index";
import Details from "@/sections/hooks/hook-details/details";
import PopularHooks from "@/sections/landing-page/popular-hooks";


const Index = ({slug}: { slug: string }) => {
    return (
        <Layout>
            <Details slug={slug}/>
            <PopularHooks className='mt-12'/>
        </Layout>
    );
};

export default Index;