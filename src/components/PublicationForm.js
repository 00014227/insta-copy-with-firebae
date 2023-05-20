import React, { useState } from 'react';

const PublicationForm = (props) => {
    

    
    return (

        <div className=' border-0 rounded-lg shadow-lg bg-white max-w-sm w-full'>

            <div class="bg-white border border-gray-300 p-6">
                <div className='flex gap-3'>
                    <img className=' rounded-full w-12 h-12 ' src=""/>

                    <div >

                        <p className=''>Axad</p>

                    </div>

                </div>
                <form>
            
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2" for="email">
                            Place
                        </label>
                        <input
                            value={props.place}
                            onChange={props.onPlaceChange}
                            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="place"
                            type="text"
                            placeholder="Enter your email"
                            name='place'
                        />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2" for="phone">
                            Description
                        </label>
                        <input
                        value={props.description}
                        onChange={props.onDescriptionChange}
                            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="description"
                            type="text"
                            placeholder="Enter your phone number"
                            name='description'
                        />
                    </div>
                   

                    <button onClick={props.onSubmit} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Submit
                    </button>
                </form>
            </div>
        </div>

    );
};

export default PublicationForm;